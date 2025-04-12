import { parse } from "date-fns";
export type STATUS_TYPE = "pending" | "sold" | "active";
export type GARAGE_TYPE = "attached" | "detached";

export type MLSDataEntry = {
  MLSIdNumber: string;
  status?: STATUS_TYPE;
  listPrice?: number;
  salePrice?: number;
  statusChangeDate?: Date;
  listDate?: Date;
  closingDate?: Date;
  DOM?: number;
  pendingDate?: Date;
  REO?: any;
  GLA?: number; //GrossLivableArea
  stories?: number;
  yearBuilt?: number;
  concessions?: string;
  landSqFt?: number;
  landAcres?: number;
  bedrooms?: number;
  bathsFull?: number;
  bathsHalf?: number;
  garageCount?: number;
  garageType?: string;
  garage?: GARAGE_TYPE;
  garageDescription?: string;
  poolType?: string;
  hasPool?: boolean;
};

export type CellType =
  | "string"
  | "date"
  | "number"
  | "boolean"
  | "status"
  | "garage";

export type CSVImportMap = {
  key: keyof MLSDataEntry;
  name: string;
  type: CellType;
};

export const DEFAULT_IMPORT_MAP: CSVImportMap[] = [
  { key: "MLSIdNumber", name: "MLS Id Number", type: "string" },
  { key: "status", name: "Status", type: "status" },
  { key: "listPrice", name: "List Price", type: "number" },
  { key: "salePrice", name: "Close Price", type: "number" },
  { key: "statusChangeDate", name: "Last Change Timestamp", type: "date" },
  { key: "listDate", name: "List Date", type: "date" },
  { key: "closingDate", name: "Closing Date", type: "date" },
  { key: "DOM", name: "Days on Market", type: "number" },
  { key: "pendingDate", name: "Pending Date", type: "date" },
  { key: "REO", name: "Real Estate Owned", type: "string" }, //what potential valsues?
  { key: "GLA", name: "Gross Livable Area", type: "number" },
  { key: "stories", name: "Stories", type: "string" }, //story conversions?
  { key: "yearBuilt", name: "Year Built", type: "number" },
  { key: "concessions", name: "Seller Concessions", type: "string" },
  { key: "landSqFt", name: "Land Square Feet", type: "number" },
  { key: "landAcres", name: "Land Acres", type: "number" },
  { key: "bedrooms", name: "Bedrooms", type: "number" },
  { key: "bathsFull", name: "Full Baths", type: "number" },
  { key: "bathsHalf", name: "Half Baths", type: "number" },
  { key: "garageCount", name: "Garage Count", type: "number" },
  { key: "garageType", name: "Garage Type", type: "garage" },
  {
    key: "garageDescription",
    name: "Garage Parking Description",
    type: "string",
  },
  { key: "hasPool", name: "Has Pool", type: "boolean" },
  { key: "poolType", name: "Pool Type", type: "string" },
];

export const parseCSVRowIntoMLSDataEntry = (
  row: string[],
  importOrder = DEFAULT_IMPORT_MAP,
): MLSDataEntry => {
  const result: MLSDataEntry = { MLSIdNumber: row[0] };

  for (let index = 0; index < importOrder.length; index++) {
    if (importOrder[index] && index < row.length) {
      const { key, type } = importOrder[index];
      const value = row[index];
      if (value && value !== "") {
        switch (type) {
          case "string":
            result[key] = value;
            break;
          case "number":
            result[key] = parseFloat(value);
            break;
          case "date":
            result[key] = parse(value.slice(0, 10), "yyyy-MM-dd", new Date());
            break;
          case "boolean":
            result[key] = value.toLowerCase() === "true" ? true : false;
            break;
          case "status":
            result[key] = value.toLowerCase() as STATUS_TYPE;
            break;
          case "garage":
            result[key] = value.toLowerCase() as GARAGE_TYPE;
            break;
        }
      }
    }
  }

  return result;
};
