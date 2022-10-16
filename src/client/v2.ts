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

  async get<T>(request: GetItemInput): Promise<Result<T>> {
    const { Item } = await this.#dynamodb.getItem(request).promise();
    if (!Item) {
      return {};
    }

    return { item: unmarshall(Item as any) as T };
  }

  async put<T>(request: PutItemInput): Promise<Result<T>> {
    const { Attributes: item } = await this.#dynamodb.putItem(request).promise();
    const result: Result<T> = {};

    // Only return the item if it was returned by the server
    if (item) {
      result.item = unmarshall(item as any) as T;
    }

    return result;
  }

  update(request: UpdateItemInput): Promise<Result> {
    throw new Error("Method not implemented.");
  }

  async delete(request: DeleteItemInput): Promise<Result> {
    const { Attributes } = await this.#dynamodb.deleteItem(request).promise();

    return { item: Attributes ? unmarshall(Attributes as any) : undefined };
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
