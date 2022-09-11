import type {
  BatchExecuteStatementInput,
  BatchGetItemInput,
  BatchWriteItemInput,
  DeleteItemInput,
  ExecuteStatementInput,
  PutItemInput,
  QueryInput,
  ScanInput,
  UpdateItemInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import DynamoDB from "aws-sdk/clients/dynamodb";
import DynamoClient, { Result, ResultPage } from "./base";

export class DynamoClientV2 implements DynamoClient {
  #dynamodb: DynamoDB;

  constructor(dynamodb: DynamoDB) {
    this.#dynamodb = dynamodb;
  }

  put(request: PutItemInput): Promise<Result> {
    throw new Error("Method not implemented.");
  }

  update(request: UpdateItemInput): Promise<Result> {
    throw new Error("Method not implemented.");
  }

  delete(request: DeleteItemInput): Promise<Result> {
    throw new Error("Method not implemented.");
  }
  async query<T>(request: QueryInput): Promise<ResultPage<T>> {
    const { Items = [], LastEvaluatedKey } = await this.#dynamodb.query(request).promise();

    return { items: Items.map((data: any) => unmarshall(data) as T), nextToken: LastEvaluatedKey };
  }

  async scan<T>(request: ScanInput): Promise<ResultPage<T>> {
    const { Items = [], LastEvaluatedKey } = await this.#dynamodb.scan(request).promise();

    return { items: Items.map((data: any) => unmarshall(data) as T), nextToken: LastEvaluatedKey };
  }

  batchGet(request: BatchGetItemInput): Promise<ResultPage> {
    throw new Error("Method not implemented.");
  }

  batchWrite(request: BatchWriteItemInput): Promise<ResultPage> {
    throw new Error("Method not implemented.");
  }

  async executeStatement<T>(request: ExecuteStatementInput): Promise<ResultPage> {
    const { LastEvaluatedKey, Items = [] } = await this.#dynamodb.executeStatement(request).promise();

    return {
      items: Items.map((item: any) => unmarshall(item) as T),
      nextToken: LastEvaluatedKey,
    };
  }

  batchExecuteStatement<T>(request: BatchExecuteStatementInput): Promise<ResultPage> {
    throw new Error("Method not implemented.");
  }
}
