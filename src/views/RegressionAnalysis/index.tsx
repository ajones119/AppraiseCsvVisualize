import { useMemo } from "react";
import { MLSDataEntry } from "../../utils/parseUtils";
import css from "./RegressionsAnalysis.module.scss"
import { getLinearRegression } from "../../utils/regressionUtils";
import ScatterChart from "./ScatterChart";

type RegressionAnalysisProps = {
    data: MLSDataEntry[],
}

const CHARTS_DEFAULT_CONFIG: {label: string, key: keyof MLSDataEntry, color: string, hideValues?: boolean}[] = [
    {label: "Garage Capacity", color: "orange", key: "garageCount"},
    {label: "Full Bathroom", color: "red", key: "bathsFull"},
    {label: "Half Baths", color: "blue", key: "bathsHalf"},
    {label: "Pool", color: "purple", key: "hasPool"},
    {label: "Square Feet", color: "green", key: "GLA", hideValues: true},
    {label: "Land Square Feet", color: "black", key: "landSqFt", hideValues: true},
]

const RegressionAnalysis = ({data}: RegressionAnalysisProps) => {
    const groups = useMemo(() => {
        const groups = CHARTS_DEFAULT_CONFIG.map(config => {;
            const regression = getLinearRegression(data, config.key);
            const regressionStart = regression.values[0][0];
            const regressionEndElement = regression.values[regression.values.length - 1];
            const regressionEnd = regressionEndElement[0];
            const counts: {[key: number]: number} = {};

            for (const value of regression.values) {
                const xVal = value[0];
                if (counts[xVal]) {
                    counts[xVal]++;
                } else {
                    counts[xVal] = 1;
                }
            }
            return {
                regression,
                color: config.color,
                label: config.label,
                hideValues: config?.hideValues,
                chartData: [
                    { label: `${config.label} - scatter`, backgroundColor: config.color, data: regression.values.map(value => ({x: value[0], y: value[1]}))},
                    {showLine: true, label: `${config.label} - line`, borderColor: config.color, data: [{x: regressionStart, y: regression.line(regressionStart)}, {x: regressionEnd, y: regression.line(regressionEnd)}]}
                ],
                occurranceMap: counts,
            };
        });
        return groups;
    }, [JSON.stringify(data)]);
    return (
        <div className={css.regression}>    
            {
                groups.map(group => 
                    <div className={css.regressionCard}>
                            <h2>{group.label}</h2>
                            <div className={css.subData}>
                                <div>R<sup>2</sup>: {group.regression.r2.toFixed(3)}</div>
                                <div>M: {group.regression.m.toFixed(2)}</div>
                                <div>B: {group.regression.b.toFixed(2)}</div>
                            </div>
                            { !group.hideValues && 
                            <table className={css.table}>
                                <tr>
                                    <th>Value</th>
                                    <th># of Occurrances</th>
                                    <th>Projection</th>
                                </tr>
                                {
                                    Object.keys(group.occurranceMap).map((key, index) => <tr className={`${css.tableRow} ${index%2 == 0 && css.secondary}`}>
                                        <td>{key}</td>
                                        <td>{group.occurranceMap[Number(key)]}</td>
                                        <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(group.regression.line(Number(key)))}</td>
                                        
                                    </tr>)
                                }
                            </table>
                            }
                            <ScatterChart groupData={group.chartData} label={group.label} />
                        
                    </div>
                )
            }
            
        </div>
    );
}
//
export default RegressionAnalysis;