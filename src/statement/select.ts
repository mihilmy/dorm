import type { ExecuteStatementInput } from "@aws-sdk/client-dynamodb";
import type Client from "../client/base";
import { MissingExecutorError } from "../errors";
import { Operator, Path, Scalar, Statement } from "./base";

export class Select<T> extends Statement<T> {
  private input: ExecuteStatementInput = {} as ExecuteStatementInput;
  private client?: Client;
  private sorting?: { key: string; order: "ASC" | "DESC" };

  buildStatement(): string {
    const lines = [
      `SELECT ${this.buildProjection()}`,
      this.buildFromClause(),
      this.buildWhereClause(),
      this.buildOrderByClause(),
    ];

    return lines.filter(Boolean).join("\n") + ";";
  }

  useExecutor(client: Client): Select<T> {
    this.client = client;

    return this;
  }

  consistent(): Select<T> {
    this.input.ConsistentRead = true;

    return this;
  }

  limit(n: number): Select<T> {
    this.input.Limit = n;

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
  or(path: Path<T>, operator: "IS NULL"): this;
  or(path: Path<T>, operator: "IS NOT NULL"): this;
  or(condition: string): this;
  or(...args: any[]): this {
    this.conditionalOperator = "OR";
    // @ts-ignore
    this.where(...args);
    this.conditionalOperator = "AND";
    return this;
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
  where(path: Path<T>, operator: "IS NULL"): this;
  where(path: Path<T>, operator: "IS NOT NULL"): this;
  where(condition: string): this;
  where(...args: any[]): this {
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

  async one(): Promise<T> {
    if (!this.client) {
      throw new MissingExecutorError();
    }

    this.input.Statement = this.buildStatement();
    const { Items } = await this.client.executeStatement<T>(this.input);

    return Items[0];
  }

  async all(): Promise<T[]> {
    if (!this.client) {
      throw new MissingExecutorError();
    }

    const resultSet = [];
    this.input.Statement = this.buildStatement();

    do {
      const response = await this.client.executeStatement<T>(this.input);
      resultSet.push(...response.Items);

      this.input.NextToken = response.NextToken;
    } while (this.input.NextToken);

    return resultSet;
  }

  // PRTOETECTED METHODS BELOW

  protected buildOrderByClause() {
    if (!this.sorting) {
      return "";
    }

    return `ORDER BY "${this.sorting.key}" ${this.sorting.order}`;
  }
}
