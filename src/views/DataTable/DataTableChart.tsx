import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TableColumn } from '../../utils/dataTableUtils';
import useTheme from '../../hooks/useTheme';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const rgbMap = [
    '#FF0000d0',
    '#00FF00d0',
    '#4169E1e0',
];

const getDataSets = (columns: TableColumn[], key: keyof Omit<TableColumn, 'columnName' | 'lowOffset' | 'highOffset' | 'showPercentChange'>) => {
    let dataArray = [];

    dataArray.push({
        label: "Average",
        data: columns.map(column => column[key]?.mean),
        backgroundColor: rgbMap[0],
    });
    dataArray.push({
        label: "Median",
        data: columns.map(column => column[key]?.median),
        backgroundColor: rgbMap[1],
    });
    dataArray.push({
        label: "Mode",
        data: columns.map(column => column[key]?.mode),
        backgroundColor: rgbMap[2],
    });

    return dataArray;
};

type DataTableChartProps = {
    columns: TableColumn[],
    rowkey: keyof Omit<TableColumn, 'columnName' | 'lowOffset' | 'highOffset' | 'showPercentChange'>,
    title: string
}

const DataTableChart = ({columns, rowkey, title}: DataTableChartProps) => {
    const {theme} = useTheme();
    const data = {
        labels: columns.map(column => column.columnName),
        datasets: getDataSets(columns, rowkey),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as 'top',
            },
            title: {
                display: true,
                text: title,
                color: theme.colors["--text-primary-color"],
                font: {
                    size: 24,
                    
                }
            },
        },
        scales: {
            x: {
                grid: {
                    color: theme.colors["--table-background-secondary-color"]
                }
            },
            y: {
                grid: {
                    color: theme.colors["--table-background-secondary-color"]
                }
            }
        }
    };
        
    return (
        <Bar data={data} options={options} />
    );
}

export default DataTableChart