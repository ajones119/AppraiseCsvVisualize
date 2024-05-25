import { useMemo } from "react";
import { MLSDataEntry } from "../../utils/parseUtils";
import css from "./RegressionsAnalysis.module.scss"
import { getLinearRegression } from "../../utils/regressionUtils";
import ScatterChart from "./ScatterChart";

type RegressionAnalysisProps = {
    data: MLSDataEntry[],
}

const CHARTS_DEFAULT_CONFIG: {label: string, key: keyof MLSDataEntry, color: string}[] = [
    {label: "Garage Capacity", color: "orange", key: "garageCount"},
    {label: "Full Bathroom", color: "red", key: "bathsFull"},
    {label: "Half Baths", color: "blue", key: "bathsHalf"},
    //{label: "Square Feet", color: "green", key: "GLA"},
    {label: "Pool", color: "purple", key: "hasPool"},

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
                chartData: [
                    { label: `${config.label} - scatter`, backgroundColor: config.color, data: regression.values.map(value => ({x: value[0], y: value[1]}))},
                    { label: `${config.label} - line`, borderColor: config.color, data: [{x: regressionStart, y: regression.line(regressionStart)}, {x: regressionEnd, y: regression.line(regressionEnd)}]}
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
                        <div>
                        <div>{group.label} - {group.regression.r2}</div>
                            {
                                Object.keys(group.occurranceMap).map((key) => <div>{key} - {group.occurranceMap[Number(key)]} - {group.regression.line(Number(key))}</div>)
                            }
                            <ScatterChart groupData={group.chartData} label={group.label} />
                        </div>
                        
                    </div>
                )
            }
            
        </div>
    );
}
//
export default RegressionAnalysis;