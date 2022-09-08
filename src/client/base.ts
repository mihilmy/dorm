import type {
  BatchExecuteStatementInput,
  BatchGetItemInput,
  BatchWriteItemInput,
  DeleteItemInput,
  ExecuteStatementInput,
  PutItemInput,
  QueryInput,
  ScanInput,
  UpdateItemInput
} from "@aws-sdk/client-dynamodb";

export default interface DynamoClient {
  put(request: PutItemInput): Promise<Result>;
  update(request: UpdateItemInput): Promise<Result>;
  delete(request: DeleteItemInput): Promise<Result>;
  query(request: QueryInput): Promise<ResultPage>;
  scan(request: ScanInput): Promise<ResultPage>;
  batchGet(request: BatchGetItemInput): Promise<ResultPage>;
  batchWrite(request: BatchWriteItemInput): Promise<ResultPage>;
  executeStatement(request: ExecuteStatementInput): Promise<ResultPage>;
  batchExecuteStatement<T>(request: BatchExecuteStatementInput): Promise<ResultPage>;
}

export interface Result {
  item: any;
}

export interface ResultPage {
  items: any[];
  nextToken?: any;
}
