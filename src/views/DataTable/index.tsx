import css from "./DataTable.module.scss"
import { TableColumn } from "../../utils/dataTableUtils"
import TableRow, {DataTableRow} from "./TableRow"
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useLocalStorage } from "usehooks-ts"
import DataTableChart from "./DataTableChart";
import { QUARTERLY, TimeSection, YEARLY } from "../../utils/constants";
import Toggle from "../../components/Toggle";

type DataTableProps = {
    columns: TableColumn[]
}

const ROWS: DataTableRow[] = [
    {id: "Sale Price Average", metaKey: "Sale Price",
        getter: (column, nextColumn) => <div>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(column.salePrice.mean || 0)} 
                ({nextColumn?.salePrice.mean && column?.showPercentChange ? ((1 - ((column.salePrice.mean || 1)/(nextColumn?.salePrice.mean || 1))) * -100).toFixed(2) : `-`}%)
            </div>
    },
    {id: "Sale Price Median",  metaKey: "Sale Price", getter: (column, nextColumn) => <div>
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(column.salePrice.median || 0)}
        ({nextColumn?.salePrice.median && column?.showPercentChange ? ((1 - ((column.salePrice.median || 1)/(nextColumn?.salePrice.median || 1))) * -100).toFixed(2) : `-`}%)
        </div>},
    {id: "Sale Price Mode",  metaKey: "Sale Price", getter: (column) => <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(column.salePrice.mode || 0)} ({column.salePrice.minimum?.toFixed(2)} / {column.salePrice.maximum?.toFixed(2)})</div>},
    {id: "Price Per Square Foot Average",  metaKey: "Price Per Square Foot", getter: (column, nextColumn) => <div>
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(column.pricePerSquareFoot.mean || 0)}
        ({nextColumn?.pricePerSquareFoot.mean && column?.showPercentChange ? ((1 - ((column.pricePerSquareFoot.mean || 1)/(nextColumn?.pricePerSquareFoot.mean || 1))) * -100).toFixed(2) : `-`}%)
    </div>},
    {id: "Price Per Square Foot Median",  metaKey: "Price Per Square Foot", getter: (column) => <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(column.pricePerSquareFoot.median || 0)}</div>},
    {id: "Price Per Square Foot Mode",  metaKey: "Price Per Square Foot", getter: (column) => <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(column.pricePerSquareFoot.mode || 0)} ({column.pricePerSquareFoot.minimum?.toFixed(2)} / {column.pricePerSquareFoot.maximum?.toFixed(2)})</div>},
    {id: "Square Feet Average",  metaKey: "Square Feet", getter: (column, nextColumn) => <div>
        {column.squareFeet.mean?.toFixed(2)}
        ({nextColumn?.squareFeet.mean && column?.showPercentChange ? ((1 - ((column.squareFeet.mean || 1)/(nextColumn?.squareFeet.mean || 1))) * -100).toFixed(2) : `-`}%)
        </div>},
    {id: "Square Feet Median",  metaKey: "Square Feet", getter: (column, nextColumn) => <div>
        {column.squareFeet.median?.toFixed(2)}
        ({nextColumn?.squareFeet.median && column?.showPercentChange ? ((1 - ((column.squareFeet.median || 1)/(nextColumn?.squareFeet.median || 1))) * -100).toFixed(2) : `-`}%)

        </div>},
    {id: "Square Feet Mode",  metaKey: "Square Feet", getter: (column) => <div>{column.squareFeet.mode?.toFixed(2)} ({column.squareFeet.minimum?.toFixed(2)} / {column.squareFeet.maximum?.toFixed(2)})</div>},
    {id: "Year Built Average",  metaKey: "Year Built", getter: (column) => <div>{column.yearBuilt.mean?.toFixed(0)}</div>},
    {id: "Year Built Median",  metaKey: "Year Built", getter: (column) => <div>{column.yearBuilt.median?.toFixed(0)}</div>},
    {id: "Year Built Mode",  metaKey: "Year Built", getter: (column) => <div>{column.yearBuilt.mode?.toFixed(0)}</div>},
]

const CHARTS_CONFIG: {rowkey :keyof Omit<TableColumn, 'columnName' | 'lowOffset' | 'highOffset' | 'showPercentChange'>, title: string}[] = [
    {rowkey: "salePrice", title: "Sale Price"},
    {rowkey: "pricePerSquareFoot", title: "Price Per Square Foot"},
    {rowkey: "squareFeet", title: "Sale Price"},
    {rowkey: "yearBuilt", title: "Year Built"},
]

const ROW_MAP: Record<string, DataTableRow> = ROWS.reduce((acc, row) => {
    acc[row.id] = row;
    return acc;
}, {} as Record<string, DataTableRow>);

const DEFAULT_ROW_ORDER: string[] = ROWS.map(row => row.id);

const DataTable = ({ columns = []}: DataTableProps) => {
    const [rows, setRows] = useLocalStorage<string[]>("AppraiseCSVisualizeRowOrder", DEFAULT_ROW_ORDER);
    const [timeType, setTimeType] = useLocalStorage<TimeSection[]>("AppraiseCSVisualizeTimeSectioning", QUARTERLY);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const handleDragEnd = (event: any) => {
        const {active, over} = event;

        if (active.id !== over.id) {
            setRows((items) => {
                const oldIndex = items.findIndex(item => item === active.id);
                const newIndex = items.findIndex(item => item === over.id);

            return arrayMove(items, oldIndex, newIndex);
        });
        }
    }

    return(
        <div>
            <div className={css.toggle}>
                <p>Quarterly</p>
                    <Toggle value={JSON.stringify(timeType) === JSON.stringify(QUARTERLY)} onClick={() => setTimeType(JSON.stringify(timeType) === JSON.stringify(QUARTERLY) ? YEARLY : QUARTERLY)} />
                <p>Yearly</p>
            </div>
            <table className={css.table}>
                <tr className={`${css.tableRow} ${css.title}`}>
                    <th>Months</th>
                    {
                        columns.map(column => <th>{column.columnName}</th>)
                    }
                </tr>
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={rows}
                            strategy={verticalListSortingStrategy}
                        >
                            {rows.map((row, index) => 
                                <TableRow row={ROW_MAP[row]} columns={columns} secondary={index % 2 == 0} />
                            )}
                    </SortableContext>
                </DndContext>
            </table>
            { CHARTS_CONFIG.map(chart => 
                    <DataTableChart columns={columns} rowkey={chart.rowkey} title={chart.title} />
                )
            }
        </div>
    );
}

export default DataTable;