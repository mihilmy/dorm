import DynamoClient from "./client/base";
import Query from "./query";

export class Table<T> {
  constructor(private props: TableProps<T>) {}

  create() {}

  read(...items: Partial<T>[]) {
    const query = new Query("R", this.props.tableName, items);

    return Object.assign({}, query.__ReadInterface__(),); 
  }

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
