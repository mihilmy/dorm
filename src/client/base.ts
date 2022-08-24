export default interface Client {
  exec<T>(): Promise<T[]>;
  batchExec<T>(): Promise<T[]>;
}