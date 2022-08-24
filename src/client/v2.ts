import type { BatchExecuteStatementInput, ExecuteStatementInput } from "@aws-sdk/client-dynamodb";
import DynamoDB from "aws-sdk/clients/dynamodb";
import Client, { _BatchExecuteStatementOutput, _ExecuteStatementOutput } from "./base";

export class ClientV2 implements Client {
  constructor(private dynamodb: DynamoDB) {}

  async executeStatement<T>(request: ExecuteStatementInput): Promise<_ExecuteStatementOutput<T>> {
    const { LastEvaluatedKey, Items = [] } = await this.dynamodb.executeStatement(request).promise();

    return {
      Items: Items.map((item) => DynamoDB.Converter.unmarshall(item) as T),
      NextToken: LastEvaluatedKey,
    };
  }

  batchExecuteStatement<T>(request: BatchExecuteStatementInput): Promise<_BatchExecuteStatementOutput<T>[]> {
    throw new Error("Method not implemented.");
  }
}
