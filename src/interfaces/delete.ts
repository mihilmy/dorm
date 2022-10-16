import Executor from "../executor";
import Statement from "../statement";
import { Path, Scalar } from "../definitions";

export default class DeleteInterface<T> {
  #statement: Statement;
  #executor: Executor;

  constructor(statement: Statement, executor: Executor) {
    this.#statement = statement;
    this.#executor = executor;
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
    this.#statement.where(...args);
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
    this.#statement.or(...args);

    return this;
  }

  async run(): Promise<void> {
    await this.#executor.all();
  }

  all(): Promise<T[]> {
    return this.#executor.all();
  }

  one(): Promise<T> {
    return this.#executor.one();
  }
}
