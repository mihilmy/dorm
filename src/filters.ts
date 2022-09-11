export default class Filters {
  #conditions: Array<Condition> = [];

  isEmpty() {
    return true;
  }
}

interface Condition {
  path: string;
  value: string | number | [string, string] | [number, number];
  comparator: string;
  booleanOperator?: "AND" | "OR";
}
