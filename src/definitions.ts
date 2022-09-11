export interface TableDef<T> {
  name: string;
  partitionKey: Extract<keyof T, string>;
  sortKey?: Extract<keyof T, string>;
  indexes?: IndexDef<T>[];
}

export interface IndexDef<T> {
  type: "GSI" | "LSI";
  name: string;
  partitionKey: Extract<keyof T, string>;
  sortKey?: Extract<keyof T, string>;
}

export type Path<T> = keyof T;
export type Scalar = string | number;
export type Operator =
  | "<"
  | "<="
  | "<>"
  | "="
  | ">"
  | ">="
  | "BETWEEN"
  | "NOT BETWEEN"
  | "BEGINS_WITH"
  | "NOT BEGINS_WITH"
  | "CONTAINS"
  | "NOT CONTAINS"
  | "IN"
  | "NOT IN"
  | "IS MISSING"
  | "IS NOT MISSING"
  | "IS NULL"
  | "IS NOT NULL"