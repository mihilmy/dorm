import Filters from "./filters";
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
  constructor(type: "C" | "R" | "U" | "D", table: string, items: Array<any> = []) {
    this.#type = type;
    this.#table = table;
    this.#items = items;
  }

  generate(): Plan {
    if (this.#type === "R") {
      // Simple plan where you basically generate a simple scan
      if (this.#items.length > 0 && this.#filters.isEmpty()) {
        return new Plan(new Scan(this.#table));
      }
    }

    return new Plan();
  }

  __ReadInterface__() {
    return {};
  }
}
