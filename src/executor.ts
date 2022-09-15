import DynamoClient from "./client/base";
import Get from "./operations/Get";
import Put from "./operations/Put";
import Query from "./operations/Query";
import Scan from "./operations/Scan";
import Statement from "./statement";

export default class Executor {
  #statement: Statement;
  #client: DynamoClient;

  constructor(client: DynamoClient, statement: Statement) {
    this.#client = client;
    this.#statement = statement;
  }

  async one<T>(): Promise<T> {
    const plan = this.#statement._generate();

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

        if (executable instanceof Get) {
          const result = await this.#client.get(executable);
          plan.collect(executable, result);
        }

        if (executable instanceof Put) {
          const result = await this.#client.put(executable);
          plan.collect(executable, result);
        }

        // Register result only if it's needed by the plan
      }
    }

    return plan.results[0];
  }

  async all<T>(): Promise<T[]> {
    const plan = this.#statement._generate();

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

        if (executable instanceof Get) {
          const result = await this.#client.get(executable);
          plan.collect(executable, result);
        }

        if (executable instanceof Put) {
          const result = await this.#client.put(executable);
          plan.collect(executable, result);
        }

        // Register result only if it's needed by the plan
      }
    }

    return plan.results;
  }
}
