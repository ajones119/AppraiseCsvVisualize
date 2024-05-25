import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeScale,
    Title,
    ScatterController
  } from 'chart.js';

//import 'chartjs-adapter-date-fns';
import useTheme from '../../hooks/useTheme';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ScatterController);
export type GroupRegressionChartData = {
  label: string,
  data: {x: number, y: number}[],
  backgroundColor?: string,
  borderColor?: string,
  type?: string
};

type ScatterChartProps = {
    groupData: GroupRegressionChartData[],
    label: string
};

const ScatterChart = ({groupData, label}: ScatterChartProps) => {
  const {theme} = useTheme();
    const chartData = {
        datasets: groupData
    };
    const options = {
        scales: {
          x: {
            title: {
              text: label,
              display: true,
            },
            grid: {
              color: theme.colors["--table-background-secondary-color"]
            },

            ticks: {
              precision: 0
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value',
            },
            grid: {
              color: theme.colors["--table-background-secondary-color"]
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
      };

      //try making all scatter?
    return (
      <div>
        
      
        <Scatter
            options={options}
            data={chartData as any}
        />
        </div>
    );
}

export default ScatterChart