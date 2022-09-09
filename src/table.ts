import DynamoClient from "./client/base";
import Executor from "./executor";
import ReadInterface from "./interfaces/Read";
import Key from "./key";
import Query from "./query";

export class Table<T> {
  #keys: Key[];

  constructor(private props: TableProps<T>) {
    this.#keys = [{ partitionKey: props.partitionKey, sortKey: props.sortKey, type: "PRIMARY" }];
    props.indexes?.forEach(({ partitionKey, sortKey, type }) => this.#keys.push({ partitionKey, sortKey, type }));
  }

  create() {}

  read(...items: Partial<T>[]) {
    const query = new Query({ type: "R", table: this.props.tableName, items, keys: this.#keys });
    const executor = new Executor(this.props.client, query);

    return new ReadInterface<T>(query, executor);
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
