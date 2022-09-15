import Executor from "../executor";
import Statement from "../statement";

export default class CreateInterface<T> {
  #statement: Statement;
  #executor: Executor;

  constructor(query: Statement, executor: Executor) {
    this.#statement = query;
    this.#executor = executor;
  }

  async run(): Promise<void> {
    await this.#executor.all();
  }

  all(): Promise<T[]> {
    // Set return values here
    return this.#executor.all();
  }

  one(): Promise<T> {
    // Set to return values here
    return this.#executor.one();
  }
}
