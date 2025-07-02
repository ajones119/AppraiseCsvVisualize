import { useEffect, useMemo, useState } from "react";
import css from "./App.module.scss";
import useTheme from "./hooks/useTheme";
import FileInput from "./components/FileInput";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "./components/DatePicker";
import {
  CSVImportMap,
  DEFAULT_IMPORT_MAP,
  MLSDataEntry,
  parseCSVRowIntoMLSDataEntry,
} from "./utils/parseUtils";
import DataTable from "./views/DataTable";
import { QUARTERLY, TimeSection } from "./utils/constants";
import { subMonths } from "date-fns";
import { calculateCell, TableColumn } from "./utils/dataTableUtils";
import Options from "./views/Options";
import { useReadLocalStorage } from "usehooks-ts";
import Tabs from "./components/Tabs";
import RegressionAnalysis from "./views/RegressionAnalysis";

function App() {
  const [tab, setTab] = useState("table");
  const csvOrder =
    useReadLocalStorage<CSVImportMap[]>(
      "AppraiseCSVisualizeImportColumnOrder",
    ) || DEFAULT_IMPORT_MAP;
  const timeType =
    useReadLocalStorage<TimeSection[]>("AppraiseCSVisualizeTimeSectioning") ||
    QUARTERLY;

  const [date, setDate] = useState<Date | null>(new Date());
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [MLSData, setMLSData] = useState<MLSDataEntry[]>([]);
  useTheme();

  const calculatedColums = useMemo<TableColumn[]>(() => {
    const columns: TableColumn[] = [];
    for (let interval = 0; interval < timeType.length; interval++) {
      const { columnName, lowOffset, highOffset, showPercentChange } =
        timeType[interval];
      const startDate = subMonths(
        date || new Date(),
        timeType[interval].lowOffset,
      );
      const endDate = subMonths(
        date || new Date(),
        timeType[interval].highOffset,
      );
      const intervalEntries = MLSData.filter((entry) => {
        return (
          entry.closingDate &&
          entry.closingDate > endDate &&
          entry.closingDate < startDate &&
          entry?.status &&
          entry?.status === "sold"
        );
      });
      const salePrice = calculateCell(
        intervalEntries,
        "salePrice",
        "Sale Price",
      );
      const pricePerSquareFoot = calculateCell(
        intervalEntries,
        "salePrice",
        "Price Per Square Foot",
        { divisorKey: "GLA" },
      );
      const squareFeet = calculateCell(intervalEntries, "GLA", "Square Feet");
      const yearBuilt = calculateCell(
        intervalEntries,
        "yearBuilt",
        "Year Built",
      );
      const numberOfEntries = intervalEntries?.length || 0;

      columns.push({
        columnName,
        lowOffset,
        highOffset,
        salePrice,
        pricePerSquareFoot,
        squareFeet,
        yearBuilt,
        showPercentChange,
        numberOfEntries,

      });
    }
    return columns;
  }, [date, JSON.stringify(MLSData), timeType]);

  useEffect(() => {
    try {
      const entries = csvData.map((row) =>
        parseCSVRowIntoMLSDataEntry(row, csvOrder),
      );
      setMLSData(entries);
    } catch (e) {
      setMLSData([]);
    }
  }, [JSON.stringify(csvOrder), JSON.stringify(csvData)]);

  return (
    <div className={css.root}>
      <div className={css.header}>
        <h2>Neighborhood Market Trends</h2>
      </div>
      <div className={css.inputs}>
        <div>
          <DatePicker
            value={date}
            onChange={(date: Date | null) => setDate(date)}
          />
        </div>
        <FileInput
          onUpload={(results) => {
            setCsvData(results?.data);
          }}
        />
      </div>
      <div className={css.content}>
        <Tabs
          activeTab={tab}
          setActiveTab={setTab}
          tabs={
            MLSData.length > 0 && calculatedColums.length > 0
              ? [
                  {
                    key: "table",
                    title: <h3>Table</h3>,
                    content: <DataTable columns={calculatedColums} effectiveDate={date || new Date()} />,
                  },
                  {
                    key: "regression",
                    title: <h3>Regression Analysis</h3>,
                    content: <RegressionAnalysis data={MLSData} />,
                  },
                  {
                    key: "options",
                    title: <h3>Options</h3>,
                    content: <Options />,
                  },
                ]
              : [
                  {
                    key: "options",
                    title: <h3>Options</h3>,
                    content: <Options />,
                  },
                ]
          }
        />
      </div>
    </div>
  );
}

export default App;
