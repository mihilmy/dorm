import type { AttributeValue, ScanInput } from "@aws-sdk/client-dynamodb";

export class Scan implements ScanInput {
  TableName: string;
  IndexName?: string;
  ExclusiveStartKey?: Record<string, AttributeValue>;
  ProjectionExpression?: string;
  FilterExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues?: Record<string, AttributeValue>;
  Segment?: number;
  TotalSegments?: number;
  Limit?: number;
  ConsistentRead?: boolean;

  constructor(tableName: string) {
    this.TableName = tableName;
  }

  useIndex(indexName: string) {
    this.IndexName = indexName;
    return this;
  }
}
