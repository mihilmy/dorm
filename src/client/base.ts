import type { BatchExecuteStatementInput, ExecuteStatementInput } from "@aws-sdk/client-dynamodb";

export default interface DynamoClient {
  executeStatement<T>(request: ExecuteStatementInput): Promise<_ExecuteStatementOutput<T>>;
  batchExecuteStatement<T>(request: BatchExecuteStatementInput): Promise<_BatchExecuteStatementOutput<T>[]>;
}

export interface _ExecuteStatementOutput<T> {
  Items: T[];
  NextToken?: any;
}

export interface _BatchExecuteStatementOutput<T> {}
