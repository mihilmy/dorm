import type { AttributeValue, DeleteItemInput, ExpectedAttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import type { Scalar, TableDef } from "../definitions";

export default class Delete implements DeleteItemInput {
  TableName: string;
  Key: Record<string, AttributeValue>;
  ReturnValues?: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, AttributeValue>;

  constructor(table: TableDef<any>, item: Record<string, any>) {
    this.TableName = table.name;
    this.Key = {
      [table.partitionKey]: marshall(item[table.partitionKey]) as unknown as AttributeValue,
    };

    if (table.sortKey) {
      this.Key[table.sortKey] = marshall(item[table.sortKey]) as unknown as AttributeValue;
    }
  }
}
