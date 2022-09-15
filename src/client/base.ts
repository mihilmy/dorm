import type {
  BatchExecuteStatementInput,
  BatchGetItemInput,
  BatchWriteItemInput,
  DeleteItemInput,
  ExecuteStatementInput,
  GetItemInput,
  PutItemInput,
  QueryInput,
  ScanInput,
  UpdateItemInput
} from "@aws-sdk/client-dynamodb";

export default interface DynamoClient {
  get<T>(request: GetItemInput): Promise<Result<T>>;
  put<T>(request: PutItemInput): Promise<Result<T>>;
  update<T>(request: UpdateItemInput): Promise<Result<T>>;
  delete<T>(request: DeleteItemInput): Promise<Result<T>>;
  query<T>(request: QueryInput): Promise<ResultPage<T>>;
  scan<T>(request: ScanInput): Promise<ResultPage<T>>;
  batchGet<T>(request: BatchGetItemInput): Promise<ResultPage<T>>;
  batchWrite<T>(request: BatchWriteItemInput): Promise<ResultPage<T>>;
  executeStatement<T>(request: ExecuteStatementInput): Promise<ResultPage<T>>;
  batchExecuteStatement<T>(request: BatchExecuteStatementInput): Promise<ResultPage<T>>;
}

export interface Result<T = any> {
  item?: T;
}

export interface ResultPage<T = any> {
  items: T[];
  nextToken?: any;
}

