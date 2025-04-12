export const STATUS_ACTIVE = "Active";
export const STATUS_PENDING = "Pending";
export const STATUS_SOLD = "Sold";

export const START_DATE = 0;
export const END_DATE = 1;

export type TimeSection = {
  columnName: string;
  lowOffset: number;
  highOffset: number;
  showPercentChange?: boolean;
};

export const YEARLY: TimeSection[] = [
  { columnName: "1-12", lowOffset: 0, highOffset: 12, showPercentChange: true },
  { columnName: "13-24", lowOffset: 12, highOffset: 24 },
  { columnName: "1-24", lowOffset: 0, highOffset: 24 },
];

export const QUARTERLY: TimeSection[] = [
  { columnName: "1-3", lowOffset: 0, highOffset: 3, showPercentChange: true },
  { columnName: "4-6", lowOffset: 3, highOffset: 6, showPercentChange: true },
  { columnName: "7-9", lowOffset: 6, highOffset: 9, showPercentChange: true },
  {
    columnName: "10-12",
    lowOffset: 9,
    highOffset: 12,
    showPercentChange: true,
  },
  {
    columnName: "13-15",
    lowOffset: 12,
    highOffset: 15,
    showPercentChange: true,
  },
  {
    columnName: "16-18",
    lowOffset: 15,
    highOffset: 18,
    showPercentChange: true,
  },
  {
    columnName: "19-21",
    lowOffset: 18,
    highOffset: 21,
    showPercentChange: true,
  },
  { columnName: "22-24", lowOffset: 21, highOffset: 24 },
];

export const MONTHLY: TimeSection[] = [
  { columnName: "1-2", lowOffset: 0, highOffset: 1, showPercentChange: true },
  { columnName: "2-3", lowOffset: 1, highOffset: 2, showPercentChange: true },
  { columnName: "3-4", lowOffset: 2, highOffset: 3, showPercentChange: true },
  { columnName: "4-5", lowOffset: 3, highOffset: 4, showPercentChange: true },
  { columnName: "5-6", lowOffset: 4, highOffset: 5, showPercentChange: true },
  { columnName: "6-7", lowOffset: 5, highOffset: 6, showPercentChange: true },
  { columnName: "7-8", lowOffset: 6, highOffset: 7, showPercentChange: true },
  { columnName: "8-9", lowOffset: 7, highOffset: 8, showPercentChange: true },
  { columnName: "9-10", lowOffset: 8, highOffset: 9, showPercentChange: true },
  {
    columnName: "10-11",
    lowOffset: 9,
    highOffset: 10,
    showPercentChange: true,
  },
  {
    columnName: "11-12",
    lowOffset: 10,
    highOffset: 11,
    showPercentChange: true,
  },
  { columnName: "12-13", lowOffset: 11, highOffset: 12 },
];
