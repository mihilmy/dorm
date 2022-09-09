import type { AttributeValue, QueryInput } from "@aws-sdk/client-dynamodb";

export default class Query implements QueryInput{
  TableName: string;
  IndexName?: string;
  ConsistentRead?: boolean;
  ScanIndexForward?: boolean;
  ProjectionExpression?: string;
  FilterExpression?: string;
  KeyConditionExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, AttributeValue>;
  Limit?: number;
  ExclusiveStartKey?: Record<string, AttributeValue>;

  constructor(tableName: string, indexName?: string) {
    this.TableName = tableName;
    this.IndexName = indexName;
  }
}