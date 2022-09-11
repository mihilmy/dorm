import { IndexDef, TableDef } from "./definitions";
import Filters from "./filters";
import Get from "./operations/Get";
import Query from "./operations/Query";
import Scan from "./operations/Scan";
import Plan from "./plan";

/**
 * Query represent a way to store the state of the chained functions
 * called by the clients.
 */
export default class Statement {
  /**
   * CRUD type requested
   */
  #type: "C" | "R" | "U" | "D";

  /**
   * Name of the DynamoDB table
   */
  #table: TableDef<any>;

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
  constructor({ type, table, items }: QueryProps) {
    this.#type = type;
    this.#table = table;
    this.#items = items;
  }

  _generate(): Plan {
    if (this.#type === "R") {
      // Simple plan where you basically generate a simple scan
      if (this.#items.length === 0 && this.#filters.isEmpty()) {
        return new Plan(new Scan(this.#table));
      }

      // Partition items into readable groups
      const plan = new Plan();

      for (const item of this.#items) {
        const operation = this.#selectReadOperation(item);
        plan.add(operation);
      }

      // TODO: Optimize the plan by merging the similar operations
      //       Gets into batch get items
      //       Scans to use OR conditions instead of issuing multiple scans

      return plan;
    }

    return new Plan();
  }

  or(...args: any[]): this {
    // this.conditionalOperator = "OR";
    // @ts-ignore
    this.where(...args);
    // this.conditionalOperator = "AND";
    return this;
  }

  where(...args: any[]) {
    const isCustom = args.length === 1 && typeof args[0] === "string";
    if (isCustom) {
      // this.commitCondition(args[0]);
    } else {
      const [path, operator, value1, value2] = args;
      const value = operator.includes("BETWEEN") ? [value1, value2] : value1;
      // this.useConditionModifier(path, operator, value);
    }

    return this;
  }

  #selectReadOperation(item: any = {}) {
    const isTableSortKeyDefined = Boolean(this.#table.sortKey);
    const hasPartitionKey = this.#isAttributeDefined(item, this.#table.partitionKey);
    const hasSortKey = this.#isAttributeDefined(item, this.#table.sortKey || "");
    const hasPrimaryKey = isTableSortKeyDefined ? hasPartitionKey && hasSortKey : hasPartitionKey;

    // CHECK 1: Most optimum read operation is GetItem
    if (hasPrimaryKey) {
      return new Get(this.#table).setKey(item[this.#table.partitionKey], item[this.#table.sortKey]);
    }

    // CHECK 2: Next best operation is a query on the primary table
    if (hasPartitionKey) {
      return new Query(this.#table).setKey(item[this.#table.partitionKey]);
    }

    // CHECK 3: Query on an index if the partition key is defined
    const optimalIndex = this.#findBestIndex(item);
    if (optimalIndex) {
      return new Query(this.#table, optimalIndex).setKey(item[optimalIndex.partitionKey], item[optimalIndex.sortKey]);
    }

    // CHECK 4: Last resort is to scan the table
    return new Scan(this.#table);
  }

  #isAttributeDefined(item: any = {}, path: string) {
    return item[path] !== undefined && item[path] !== null && item[path] !== "";
  }

  #findBestIndex(item: any = {}) {
    const indexKeys = this.#table.indexes || [];
    let optimalIndex: IndexDef<any>;

    for (const index of indexKeys) {
      const isIndexSortKeyDefined = Boolean(index.sortKey);
      const hasPartitionKey = this.#isAttributeDefined(item, index.partitionKey);
      const hasSortKey = this.#isAttributeDefined(item, index.sortKey || "");
      const hasFullKey = isIndexSortKeyDefined ? hasPartitionKey && hasSortKey : hasPartitionKey;

      if (hasFullKey) {
        return index;
      }

      if (hasPartitionKey) {
        optimalIndex = index;
      }
    }

    return optimalIndex;
  }
}

export interface QueryProps {
  type: "C" | "R" | "U" | "D";
  table: TableDef<any>;
  items: any[];
}
