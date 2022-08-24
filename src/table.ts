import DynamoClient from "./client/base"

export class Table<T> {

  constructor(props: TableProps<T>) {

  }

  create() {}

  read() {}

  update() {}

  delete() {}
}


export interface TableProps<T> {
  client: DynamoClient;
  tableName: string;
  partitionKey: Extract<keyof T, string>;
  sortKey?: Extract<keyof T, string>;
  indexes?: Index<T>[];
}

export interface Index<T> {
  type: "GSI" | "LSI";
  indexName: string;
  partitionKey: Extract<keyof T, string>;
  sortKey?: Extract<keyof T, string>;
}