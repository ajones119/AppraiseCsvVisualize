import { linearRegression, linearRegressionLine, rSquared } from "simple-statistics";
import { MLSDataEntry } from "./parseUtils";

export type LinearRegressionData = {
    m: number,
    b: number,
    values: number[][],
    line: (x: number) => number,
    r2: number
}

export const getLinearRegression = (entries: MLSDataEntry[], xAxisKey: keyof MLSDataEntry = "closingDate" ,isXAxisDate = false): LinearRegressionData => {
    const filteredEntries = entries.filter(entry => entry.salePrice && entry[xAxisKey] !== undefined);
    const values = filteredEntries.map(entry => [Number(isXAxisDate ? entry[xAxisKey].getTime() : entry[xAxisKey] || 0), Number(entry.salePrice)]).sort((a, b) => a[0] - b[0]);
    const regression = linearRegression(values);
    const line = linearRegressionLine(regression);
    const r2 = rSquared(values, line);
    

    return {m: regression.m, b: regression.b, values: values, line, r2}
}

export type GroupFilter = {
    hasPool?: boolean,
    bedroomsMin?: number, 
    bedroomsMax?: number,
    bathroomFullMin?: number,
    bathroomFullMax?: number,
    bathroomHalfMin?: number,
    bathroomHalfMax?: number,
    garageCountMin?: number,
    garageCountMac?: number,
    color: string,
    label: string
}

export const filterDataByGroupFilter = (entries: MLSDataEntry[], filter: GroupFilter) => {
    return entries.filter(entry => {
        let inGroup = true;

        if (filter.hasPool !== undefined) {
            switch (filter.hasPool) {
                case true:
                    inGroup = !!entry.hasPool;
                    break;
                case false:
                    inGroup = !entry.hasPool;
                    break;
            }
        }

        if (filter.bedroomsMin !== undefined) {
            inGroup = inGroup && (entry?.bedrooms || 0) >= filter.bedroomsMin;
        }
        if (filter.bedroomsMax !== undefined) {
            inGroup = inGroup && (entry?.bedrooms || 0) <= filter.bedroomsMax;
        }
        if (filter.bathroomFullMin !== undefined) {
            inGroup = inGroup && (entry?.bathsFull || 0) >= filter.bathroomFullMin;
        }
        if (filter.bathroomFullMax !== undefined) {
            inGroup = inGroup && (entry?.bathsFull || 0) <= filter.bathroomFullMax;
        }
        if (filter.bathroomHalfMin !== undefined) {
            inGroup = inGroup && (entry?.bathsHalf || 0) >= filter.bathroomHalfMin;
        }
        if (filter.bathroomHalfMax !== undefined) {
            inGroup = inGroup && (entry?.bathsHalf || 0) <= filter.bathroomHalfMax;
        }

        return inGroup;
    })
}