import type { ExecuteStatementInput } from "@aws-sdk/client-dynamodb";
import type Client from "../client/base";
import { MissingExecutorError } from "../errors";
import { Statement } from "./base";

export class Select<T> extends Statement {
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
    } while(this.input.NextToken)


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
