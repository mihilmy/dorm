import type { Result, ResultPage } from "./client/base";
import type { Scan } from "./operations/Scan";

type Executable = Scan;

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
    const items = "item" in result ? [result.item] : result.items;

    if (this.state.has(executable)) {
      this.state.get(executable)?.push(...items);
    } else {
      this.results.push(...items);
    }
  }
}
