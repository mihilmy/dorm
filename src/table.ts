import DynamoClient from "./client/base";
import { Select } from "./statement/select";

export class Table<T> {
  constructor(private props: TableProps<T>) {}

  create() {}

  read(...items: Partial<T>[]): Select<T> {
    const select = new Select<T>(this.props.tableName).useExecutor(this.props.client);

    // Query optimizer algorithm

    // 1. Create groups
    // Group 1: Group items that can do direct GetItem or QueryItem calls together
    //          Check for primary key existence

    // Group 2: Group items by index that can do direct QueryItem calls together

    // Group 3: remaining

    // 2. Group [1,2] can be chunked by 100s or until 8kb limit in a single 
    //    select as long as no filters are needed

    // 3. Group 3 can be ORed together into a single expression 

    
    // if param is a primary key then embed as part of an IN 
    // use index if param is a 

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
