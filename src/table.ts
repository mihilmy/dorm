import DynamoClient from "./client/base";
import Executor from "./executor";
import ReadInterface from "./interfaces/read";
import { TableDef } from "./definitions";
import Statement from "./statement";
import CreateInterface from "./interfaces/create";

export class Table<T> {
  #client: DynamoClient;
  #table: TableDef<T>;

  constructor(props: TableProps<T>) {
    this.#client = props.client;
    this.#table = props.table;
  }

  create(...items: Partial<T>[]) {
    const statement = new Statement({ type: "C", table: this.#table, items });
    const executor = new Executor(this.#client, statement);

    return new CreateInterface<T>(statement, executor);
  }

  read(...items: Partial<T>[]) {
    const statement = new Statement({ type: "R", table: this.#table, items });
    const executor = new Executor(this.#client, statement);

    return new ReadInterface<T>(statement, executor);
  }

  update() {}

  delete() {}
}

export interface TableProps<T> {
  client: DynamoClient;
  table: TableDef<T>;
}

