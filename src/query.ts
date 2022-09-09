import Filters from "./filters";
import Key from "./key";
import { Scan } from "./operations/Scan";
import Plan from "./plan";

/**
 * Query represent a way to store the state of the chained functions
 * called by the clients.
 */
export default class Query {
  /**
   * CRUD type requested
   */
  #type: "C" | "R" | "U" | "D";

  /**
   * Name of the DynamoDB table
   */
  #table: string;

  /**
   * Table keys used to support the best type of read operation
   */
  #keys: Key[];

  /**
   * Adjusts the sorting by a specific key
   */
  #sort?: { path: string; order: "ASC" | "DESC" };

  /**
   * Specifies the items to fetch from the table
   */
  #project?: string[];

  /**
   * Items to operate on this depends on the CRUD type
   * @example C | U would represent the items to create or update
   * @example R     would represent the items to fetch or filter on
   * @example D     would represent the items to delete
   */
  #items: Array<any> = [];

  /**
   * Models all the where clause filters applied to the query
   */
  #filters: Filters = new Filters();

  /**
   * Used for parallel scans to help achieve a higher throughput
   */
  #concurency: number = 0;

  /**
   * Creates a new query state holder
   */
  constructor({ type, table, items, keys }: QueryProps) {
    this.#type = type;
    this.#table = table;
    this.#items = items;
    this.#keys = keys;
  }

  _generate(): Plan {
    if (this.#type === "R") {
      // Simple plan where you basically generate a simple scan
      if (this.#items.length === 0 && this.#filters.isEmpty()) {
        return new Plan(new Scan(this.#table));
      }
      // TODO: Look into filters
      // Partition items into readable groups
      const readableGroups: any = {};
      for (const item of this.#items) {
        // Check if item can be read via GetItem
        //   - Does item have the partition key and sort key for the primary table?
        //   - If there is already GetItem in the group
        //   - Remove the GetItem and refactor to a BatchGetItem

        // Check if item can be read via BatchGetItem
        //   - Find the first entry that has an open spot

        // Check if item can be read via Query
        //   - Does item have the partition key and sort key for an index?
        //   - Does item have the partition key?
        //   - Can you be read via Query?

        // Check if item can be read via Scan
        //   - Fallback to a single scan via ORs
      }
    }

    return new Plan();
  }

  or(...args: any[]): this {
    this.conditionalOperator = "OR";
    // @ts-ignore
    this.where(...args);
    this.conditionalOperator = "AND";
    return this;
  }

  where(...args: any[]) {
    const isCustom = args.length === 1 && typeof args[0] === "string";
    if (isCustom) {
      this.commitCondition(args[0]);
    } else {
      const [path, operator, value1, value2] = args;
      const value = operator.includes("BETWEEN") ? [value1, value2] : value1;
      this.useConditionModifier(path, operator, value);
    }

    return this;
  }
}

export interface QueryProps {
  type: "C" | "R" | "U" | "D";
  table: string;
  keys: Key[];
  items: any[];
}
