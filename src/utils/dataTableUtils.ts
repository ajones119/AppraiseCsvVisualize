import {mean as smean, median as smedian, mode as smode} from "simple-statistics";
import { MLSDataEntry } from "./parseUtils"

export type NumericTableCellData = {
    name?: string;
    numberOfEntries: number;
    mean?: number,
    median?: number,
    mode?: number,
    //min?: number,
    //max?: number,
    //percentChange?: number
}

export type TableColumn = {
    columnName: string,
    lowOffset: number,
    highOffset: number
    salePrice: NumericTableCellData,
    squareFeet: NumericTableCellData,
    yearBuilt: NumericTableCellData
    pricePerSquareFoot: NumericTableCellData,
    showPercentChange?: boolean,
    //numberOfEntries: number,
}

export const calculateMean = (values: number[]) => {
    let sum = 0;
    let count = 0;

    values.forEach((value) => {
            sum += value || 0;
            count ++;
    });
    const average = sum && count ? sum/count : 0;

    return average || 0;
}

export const calculateMedian = (values: number[]) => {
    let median = 0;

    const middle = Math.floor(values.length / 2),
        nums = [...values].sort((a, b) => a - b);

    median =
    values.length % 2 !== 0
        ? Number(nums[middle])
        : (Number(nums[middle - 1]) + Number(nums[middle])) / 2;  
    return median;
}

export const calculateMode = (values: number[]) => {
    const frequency = new Map<number, number>();

    values.forEach((value) => {
        frequency.set(value, (frequency.get(value) || 0) + 1);
    });

    let modeList: number[] = [];
    let maxFrequency = 0;

    for (const [number, count] of frequency.entries()) {
        if (count > maxFrequency) {
            maxFrequency = count;
            modeList = [number];
        } else if (count === maxFrequency) {
            modeList.push(number);
        }
    }

    let mode = 0;
    if (modeList.length > 1) {
        let sum = 0;

        for (let i = 0; i < modeList.length; i++) {
            sum += modeList[i];
        }

        mode = sum/modeList.length;
    } else if (modeList.length === 1) {
        mode = modeList[0];
    }

    return mode !== null ? mode : 0;
}

export const calculateCell = (data: MLSDataEntry[], key: keyof MLSDataEntry, name: string, options: {divisorKey?: keyof MLSDataEntry, defaultEmpty?: boolean} = {}) => {
    let values = data.map(entry => entry[key]);
    
    if (options.divisorKey) {
        const secondaryValues = data.map(entry => options.divisorKey && entry[options.divisorKey]);

        values = values.map((value, index) => {
            const divisorValue = secondaryValues[index];
            if (!isNaN(value) && !isNaN(divisorValue) && divisorValue !== 0) {
                return value/divisorValue;
            } else {
                return null;
            }
        });
    }

    values = values.filter(value => !isNaN(value))
    const numberOfEntries = values.length;

    //const mean = calculateMean(values);
    const mean = smean(numberOfEntries > 1 ? values : [0])
    //const median = calculateMedian(values)
    const median = smedian(numberOfEntries > 1 ? values : [0])

    //const mode = calculateMode(values)
    const mode = smode(numberOfEntries > 1 ? values : [0])


    return {mean, median, mode, numberOfEntries, name}
}

export const START_DATE = 0;
export const END_DATE = 1;


