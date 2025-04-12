import css from "./DataTable.module.scss";
import { TableColumn } from "../../utils/dataTableUtils";
import TableRow, { DataTableRow } from "./TableRow";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useLocalStorage } from "usehooks-ts";
import DataTableChart from "./DataTableChart";
import { MONTHLY, QUARTERLY, TimeSection, YEARLY } from "../../utils/constants";
import { useMemo } from "react";
import Button from "../../components/Button";

type DataTableProps = {
  columns: TableColumn[];
};

const getPercentChange = (current: number = 0, next: number = 1) => {
  const change = (1 - current / next) * -100;
  if (change === Infinity || isNaN(change) || current === next) {
    return "0.00%";
  }
  return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
};

const ROWS: DataTableRow[] = [
  {
    id: "Sale Price Average",
    metaKey: "Sale Price",
    getter: (column, nextColumn) => (
      <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(column.salePrice.mean || 0)}
        </div>
        <div>
          {nextColumn?.salePrice.mean &&
            column?.showPercentChange &&
            getPercentChange(column.salePrice.mean, nextColumn?.salePrice.mean)}
        </div>
      </div>
    ),
  },
  {
    id: "Sale Price Median",
    metaKey: "Sale Price",
    getter: (column, nextColumn) => (
      <div style={{ display: "flex", gap: 4, flexDirection: "column" }}>
        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(column.salePrice.median || 0)}
        </div>
        <div>
          {nextColumn?.salePrice.median &&
            column?.showPercentChange &&
            getPercentChange(
              column.salePrice.median,
              nextColumn?.salePrice.median,
            )}
        </div>
      </div>
    ),
  },
  {
    id: "Sale Price Mode",
    metaKey: "Sale Price",
    getter: (column) => (
      <div>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(column.salePrice.mode || 0)}{" "}
        ({column.salePrice.minimum?.toFixed(2)} /{" "}
        {column.salePrice.maximum?.toFixed(2)})
      </div>
    ),
  },
  {
    id: "Price Per Square Foot Average",
    metaKey: "Price Per Square Foot",
    getter: (column, nextColumn) => (
      <div>
        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(column.pricePerSquareFoot.mean || 0)}
        </div>
        <div>
          {nextColumn?.pricePerSquareFoot.mean &&
            column?.showPercentChange &&
            getPercentChange(
              column.pricePerSquareFoot.mean,
              nextColumn?.pricePerSquareFoot.mean,
            )}
        </div>
      </div>
    ),
  },
  {
    id: "Price Per Square Foot Median",
    metaKey: "Price Per Square Foot",
    getter: (column) => (
      <div>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(column.pricePerSquareFoot.median || 0)}
      </div>
    ),
  },
  {
    id: "Price Per Square Foot Mode",
    metaKey: "Price Per Square Foot",
    getter: (column) => (
      <div>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(column.pricePerSquareFoot.mode || 0)}{" "}
        ({column.pricePerSquareFoot.minimum?.toFixed(2)} /{" "}
        {column.pricePerSquareFoot.maximum?.toFixed(2)})
      </div>
    ),
  },
  {
    id: "Square Feet Average",
    metaKey: "Square Feet",
    getter: (column, nextColumn) => (
      <div>
        <div>{column.squareFeet.mean?.toFixed(0)}</div>
        <div>
          {nextColumn?.squareFeet.mean &&
            column?.showPercentChange &&
            getPercentChange(
              column.squareFeet.mean,
              nextColumn?.squareFeet.mean,
            )}
        </div>
      </div>
    ),
  },
  {
    id: "Square Feet Median",
    metaKey: "Square Feet",
    getter: (column, nextColumn) => (
      <div>
        <div>{column.squareFeet.median?.toFixed(0)}</div>
        <div>
          {nextColumn?.squareFeet.median &&
            column?.showPercentChange &&
            getPercentChange(
              column.squareFeet.median,
              nextColumn?.squareFeet.median,
            )}
        </div>
      </div>
    ),
  },
  {
    id: "Square Feet Mode",
    metaKey: "Square Feet",
    getter: (column) => (
      <div>
        {column.squareFeet.mode?.toFixed(0)} (
        {column.squareFeet.minimum?.toFixed(0)} /{" "}
        {column.squareFeet.maximum?.toFixed(0)})
      </div>
    ),
  },
  {
    id: "Year Built Average",
    metaKey: "Year Built",
    getter: (column) => <div>{column.yearBuilt.mean?.toFixed(0)}</div>,
  },
  {
    id: "Year Built Median",
    metaKey: "Year Built",
    getter: (column) => <div>{column.yearBuilt.median?.toFixed(0)}</div>,
  },
  {
    id: "Year Built Mode",
    metaKey: "Year Built",
    getter: (column) => <div>{column.yearBuilt.mode?.toFixed(0)}</div>,
  },
  {
    id: "Total Entries",
    metaKey: "Total Entries",
    getter: (column) => <div>{column.numberOfEntries}</div>,
  },
];

const CHARTS_CONFIG: {
  rowkey: keyof Omit<
    TableColumn,
    | "columnName"
    | "lowOffset"
    | "highOffset"
    | "showPercentChange"
    | "numberOfEntries"
  >;
  title: string;
}[] = [
  { rowkey: "salePrice", title: "Sale Price" },
  { rowkey: "pricePerSquareFoot", title: "Price Per Square Foot" },
  { rowkey: "squareFeet", title: "Sale Price" },
  { rowkey: "yearBuilt", title: "Year Built" },
];

const ROW_MAP: Record<string, DataTableRow> = ROWS.reduce(
  (acc, row) => {
    acc[row.id] = row;
    return acc;
  },
  {} as Record<string, DataTableRow>,
);

const DEFAULT_ROW_ORDER: string[] = ROWS.map((row) => row.id);

const DataTable = ({ columns = [] }: DataTableProps) => {
  const [rows, setRows] = useLocalStorage<string[]>(
    "AppraiseCSVisualizeRowOrder",
    DEFAULT_ROW_ORDER,
  );
  const [timeType, setTimeType] = useLocalStorage<TimeSection[]>(
    "AppraiseCSVisualizeTimeSectioning",
    QUARTERLY,
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex((item) => item === active.id);
        const newIndex = items.findIndex((item) => item === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const validRowIds = ROWS.map((row) => row.id);
  // Ensure rows contain all valid rows in correct order, filtering out any unknown rows
  const allRows = useMemo(() => {
    const currentSet = new Set(rows);
    const missingRows = validRowIds.filter((id) => !currentSet.has(id));
    const filteredRows = rows.filter((id) => validRowIds.includes(id));
    return [...filteredRows, ...missingRows];
  }, [rows]);

  return (
    <div>
      <div className={css.toggle}>
        <Button
          style={
            JSON.stringify(timeType) === JSON.stringify(MONTHLY)
              ? { backgroundColor: "green" }
              : undefined
          }
          onClick={() => {
            setTimeType(MONTHLY);
          }}
        >
          Monthly
        </Button>
        <Button
          style={
            JSON.stringify(timeType) === JSON.stringify(QUARTERLY)
              ? { backgroundColor: "green" }
              : undefined
          }
          onClick={() => {
            setTimeType(QUARTERLY);
          }}
        >
          Quarterly
        </Button>
        <Button
          style={
            JSON.stringify(timeType) === JSON.stringify(YEARLY)
              ? { backgroundColor: "green" }
              : undefined
          }
          onClick={() => {
            setTimeType(YEARLY);
          }}
        >
          Yearly
        </Button>
      </div>
      <table className={css.table}>
        <tr className={`${css.tableRow} ${css.title}`}>
          <th>Months</th>
          {columns.map((column) => (
            <th>{column.columnName}</th>
          ))}
        </tr>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={rows} strategy={verticalListSortingStrategy}>
            {allRows.map((row, index) => (
              <TableRow
                row={ROW_MAP[row]}
                columns={columns}
                secondary={index % 2 == 0}
              />
            ))}
          </SortableContext>
        </DndContext>
      </table>
      {CHARTS_CONFIG.map((chart) => (
        <DataTableChart
          columns={columns}
          rowkey={chart.rowkey}
          title={chart.title}
        />
      ))}
    </div>
  );
};

export default DataTable;
