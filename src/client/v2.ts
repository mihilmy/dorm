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
import DynamoDB from "aws-sdk/clients/dynamodb";
import DynamoClient, { Result, ResultPage } from "./base";

export class DynamoClientV2 implements DynamoClient {
  #dynamodb: DynamoDB;
  #documentClient: DynamoDB.DocumentClient;

  constructor(dynamodb: DynamoDB) {
    this.#dynamodb = dynamodb;
    this.#documentClient = new DynamoDB.DocumentClient({ service: dynamodb });
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
  query(request: QueryInput): Promise<ResultPage> {
    throw new Error("Method not implemented.");
  }

  async scan(request: ScanInput): Promise<ResultPage> {
    const { Items = [], LastEvaluatedKey } = await this.#documentClient.scan(request).promise();

    return { items: Items, nextToken: LastEvaluatedKey };
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
      items: Items.map((item) => DynamoDB.Converter.unmarshall(item) as T),
      nextToken: LastEvaluatedKey,
    };
  }

  batchExecuteStatement<T>(request: BatchExecuteStatementInput): Promise<ResultPage> {
    throw new Error("Method not implemented.");
  }
}
