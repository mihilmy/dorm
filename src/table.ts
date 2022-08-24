import DynamoClient from "./client/base"
import { Select } from "./statement/select";

export class Table<T> {

  constructor(private props: TableProps<T>) {
  }

  create() {}

  read(...itemKeys: (Partial<T>)[]) {
    const select = new Select(this.props.tableName);

    return select;
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