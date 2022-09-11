import DynamoClient from "./client/base";
import Query from "./operations/Query";
import { Scan } from "./operations/Scan";
import Statement from "./statement";

export default class Executor {
  #query: Statement;
  #client: DynamoClient;

  constructor(client: DynamoClient, query: Statement) {
    this.#client = client;
    this.#query = query;
  }

  async one<T>(): Promise<T> {
    const plan = this.#query._generate();

    for (const executable of plan.executables) {
      if (Array.isArray(executable)) {
        // Run in parallel
      } else {
        // Run in series
        if (executable instanceof Scan) {
          const result = await this.#client.scan(executable);
          plan.collect(executable, result);
        }

        if (executable instanceof Query) {
          const result = await this.#client.query(executable);
          plan.collect(executable, result);
        }

        // Register result only if it's needed by the plan
      }
    }

    return plan.results[0];
  }

  async all<T>(): Promise<T[]> {
    const plan = this.#query._generate();

    for (const executable of plan.executables) {
      if (Array.isArray(executable)) {
        // Run in parallel
      } else {
        // Run in series
        if (executable instanceof Scan) {
          do {
            const result = await this.#client.scan(executable);
            plan.collect(executable, result);
            executable.ExclusiveStartKey = result.nextToken;
          } while (executable.ExclusiveStartKey);
        }

        if (executable instanceof Query) {
          do {
            const result = await this.#client.query(executable);
            plan.collect(executable, result);
            executable.ExclusiveStartKey = result.nextToken;
          } while (executable.ExclusiveStartKey);
        }

        // Register result only if it's needed by the plan
      }
    }

    return plan.results;
  }
}
