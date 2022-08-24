export class MissingExecutorError extends Error {
  constructor() {
    super("Missing dynamodb statement executor. You must use the `useExecutor()` hook to set the executor. This is normally done for you if you use the Table abstraction.");
    this.name = "MissingExecutorError";
  }
}