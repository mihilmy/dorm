import type { AttributeValue, ScanInput } from "@aws-sdk/client-dynamodb";
import { TableDef } from "../definitions";

export default class Scan implements ScanInput {
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

  constructor(table: TableDef<any>) {
    this.TableName = table.name;
  }

  useIndex(indexName: string) {
    this.IndexName = indexName;
    return this;
  }
}
