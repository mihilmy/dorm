import type DynamoClient from "./client/base";

export default class Query {
  /**
   * CRUD operation requested
   */
  #operation: "C" | "R" | "U" | "D";

  /**
   * Name of the DynamoDB table
   */
  #table: string;

  /**
   * Adjusts the sorting by a specific key
   */
  #sort?: { path: string; order: "ASC" | "DESC" };

  /**
   * Specifies the items to fetch from the table
   */
  #project?: string[];

  /**
   * Creates a set of readable groups where similar key sets are added together
   */
  #groups: Map<string, Group> = new Map();

  /**
   * Used for parallel scans to help achieve a higher throughput
   */
  #concurency: number = 0;

  generate(): Plan {
    return;
  }
}

interface Group {
  keys: any[];
  api:  "GET" | "BATCH_GET" | "QUERY" | "SCAN";
  index?: string;
  partial?: boolean;
}

interface Plan {
  
}

interface Statement {
  api: keyof DynamoClient;
  input: any;
}
