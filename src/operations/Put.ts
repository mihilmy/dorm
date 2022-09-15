import type { AttributeValue, ExpectedAttributeValue, PutItemInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { TableDef } from "../definitions";


export default class Put implements PutItemInput {
  TableName: string;
  Item: Record<string, AttributeValue>;
  ReturnValues?: string;
  ConditionExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, AttributeValue>;

  constructor(table: TableDef<any>, item: any) {
    this.TableName = table.name;
    this.Item = marshall(item, { convertClassInstanceToMap: true });
  }
}