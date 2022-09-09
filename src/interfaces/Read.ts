import Executor from "../executor";
import Query from "../query";

export default class ReadInterface<T> {
  #query: Query;

  all: () => Promise<T[]>;
  one: () => Promise<T>;

  constructor(query: Query, executor: Executor) {
    this.#query = query;
    this.all = executor.all;
    this.one = executor.one;
  }

  where(path: Path<T>, operator: "<" | "<=" | "<>" | "=" | ">" | ">=", value: Scalar): this;
  where(path: Path<T>, operator: "BETWEEN", lowerBound: Scalar, upperBound: Scalar): this;
  where(path: Path<T>, operator: "NOT BETWEEN", lowerBound: Scalar, upperBound: Scalar): this;
  where(path: Path<T>, operator: "BEGINS_WITH", value: string): this;
  where(path: Path<T>, operator: "NOT BEGINS_WITH", value: string): this;
  where(path: Path<T>, operator: "CONTAINS", value: Scalar): this;
  where(path: Path<T>, operator: "NOT CONTAINS", value: Scalar): this;
  where(path: Path<T>, operator: "IN", values: Scalar[]): this;
  where(path: Path<T>, operator: "NOT IN", values: Scalar[]): this;
  where(path: Path<T>, operator: "IS MISSING"): this;
  where(path: Path<T>, operator: "IS NOT MISSING"): this;
  where(condition: string): this;
  where(...args: any[]): this {
    this.#query.where(...args);
    return this;
  }

  or(path: Path<T>, operator: "<" | "<=" | "<>" | "=" | ">" | ">=", value: Scalar): this;
  or(path: Path<T>, operator: "BETWEEN", lowerBound: Scalar, upperBound: Scalar): this;
  or(path: Path<T>, operator: "NOT BETWEEN", lowerBound: Scalar, upperBound: Scalar): this;
  or(path: Path<T>, operator: "BEGINS_WITH", value: string): this;
  or(path: Path<T>, operator: "NOT BEGINS_WITH", value: string): this;
  or(path: Path<T>, operator: "CONTAINS", value: Scalar): this;
  or(path: Path<T>, operator: "NOT CONTAINS", value: Scalar): this;
  or(path: Path<T>, operator: "IN", values: Scalar[]): this;
  or(path: Path<T>, operator: "NOT IN", values: Scalar[]): this;
  or(path: Path<T>, operator: "IS MISSING"): this;
  or(path: Path<T>, operator: "IS NOT MISSING"): this;
  or(condition: string): this;
  or(...args: any[]): this {
    this.#query.or(...args);

    return this;
  }
}

interface Where {
  (path: string, value: string | number | [string, string] | [number, number], comparator: string): this;
}