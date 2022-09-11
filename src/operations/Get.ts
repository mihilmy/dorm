import type { AttributeValue, GetItemInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import type { Scalar, TableDef } from "../definitions";

export default class Get implements GetItemInput {
  TableName: string;
  Key: Record<string, AttributeValue>;
  ProjectionExpression?: string;
  ExpressionAttributeNames?: Record<string, string>;

  // INTERNAL STATE
  #partitionKeyName: string;
  #sortKeyName?: string;

  constructor(table: TableDef<any>) {
    this.#partitionKeyName = table.partitionKey;
    this.#sortKeyName = table.sortKey;
    this.TableName = table.name;
  }

  setKey(partitionKey: Scalar, sortKey?: Scalar) {
    this.Key = {
      [this.#partitionKeyName]: marshall(partitionKey) as unknown as AttributeValue,
    };

    if (this.#sortKeyName) {
      this.Key[this.#sortKeyName] = marshall(sortKey) as unknown as AttributeValue;
    }

    return this;
  }
}
