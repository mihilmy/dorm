import type { AttributeValue, QueryInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { IndexDef, Scalar, TableDef } from "../definitions";

export default class Query implements QueryInput {
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

  // INTERNAL STATE
  #partitionKeyName: string;
  #sortKeyName?: string;

  constructor(table: TableDef<any>, index?: IndexDef<any>) {
    this.TableName = table.name;
    this.#partitionKeyName = table.partitionKey;
    this.#sortKeyName = table.sortKey;

    if (index) {
      this.IndexName = index.name;
      this.#partitionKeyName = index.partitionKey;
      this.#sortKeyName = index.sortKey;
    }
  }

  setKey(partitionKey: Scalar, sortKey?: Scalar) {
    // TODO: This should be revised to use the same logic as the filters
    this.KeyConditionExpression = `#pk = :pk`;
    this.ExpressionAttributeNames = {
      "#pk": this.#partitionKeyName,
    };
    this.ExpressionAttributeValues = {
      ":pk": marshall(partitionKey) as unknown as AttributeValue,
    };

    if (this.#sortKeyName) {
      this.KeyConditionExpression += ` AND #sk = :sk`;
      this.ExpressionAttributeNames["#sk"] = this.#sortKeyName;
      this.ExpressionAttributeValues[":sk"] = marshall(sortKey) as unknown as AttributeValue;
    }

    return this;
  }
}
