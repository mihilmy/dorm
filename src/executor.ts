import DynamoClient from "./client/base";
import Query from "./query";

export default class Executor {
  #query: Query;
  #client: DynamoClient;

  constructor(client: DynamoClient, query: Query) {
    this.#client = client;
    this.#query = query;
  }

  async one(): Promise<T> {
    const plan = this.#query.generate();
    const { Items } = await this.#client.executeStatement<T>(this.input);

    return Items[0];
  }

  async all(): Promise<T[]> {
    const resultSet = [];
    this.input.Statement = this.buildStatement();

    do {
      const response = await this.client.executeStatement<T>(this.input);
      resultSet.push(...response.Items);

      this.input.NextToken = response.NextToken;
    } while (this.input.NextToken);

    return resultSet;
  }
}