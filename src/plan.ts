import type { Result, ResultPage } from "./client/base";
import type Get from "./operations/Get";
import type Put from "./operations/Put";
import type Query from "./operations/Query";
import type Scan from "./operations/Scan";

type Executable = Get | Query | Scan | Put ;

export default class Plan {
  executables: Array<Executable | Executable[]> = [];
  state: Map<Executable, any[]> = new Map();
  results: any[] = [];

  constructor(...executable: Executable[]) {
    this.add(...executable);
  }

  add(...executable: Executable[]) {
    if (executable.length === 1) {
      this.executables.push(executable[0]);
    } else {
      this.executables.push(executable);
    }

    return this;
  }

  register(executable: Executable) {
    // Stateful operations should be registered during plan creation
    this.state.set(executable, []);
  }

  collect(executable: Executable, result: Result | ResultPage) {
    const items = Plan.toItemList(result);

    if (this.state.has(executable)) {
      this.state.get(executable)?.push(...items);
    } else {
      this.results.push(...items);
    }
  }

  static toItemList(result: Result | ResultPage) {
    const items = [];
    if ("item" in result && result.item) {
      items.push(result.item);
    }
    if ("items" in result && result.items) {
      items.push(...result.items);
    }

    return items;
  }
}
