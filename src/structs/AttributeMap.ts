import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Path } from "../definitions";

export default class AttributeMap {
  #names = new Map<string, string>();
  #values = new Map<string, any>();
  #counter: number = 0;

  addName(path: Path<any>) {
    const pathList = [path];
    let pathExpr = "";

    for (const entry of pathList) {
      if (!pathExpr) {
        pathExpr = this.#insertName(entry as string);
      } else if (typeof entry === "number") {
        pathExpr += `[${entry}]`;
      } else {
        pathExpr += `.${this.#insertName(entry as string)}`;
      }
    }

    return pathExpr;
  }

  addValue(value: any) {
    if (value === undefined) return;

    return this.#insertValue(value);
  }

  toExpressionAttributeNames(expressions: string[] = []): Record<string, string> {
    const attributeNames: Record<string, string> = {};
    let count = 0;
    // Build a unique token set using the expression attribute value placeholder
    const tokens = new Set<string>(expressions.flatMap((expr) => expr?.match(/#n\d+/g) || []));
    for (const [key, name] of this.#names.entries()) {
      // Only add the map key if it exists in the expression
      if (tokens.has(key)) {
        attributeNames[key] = name;
        count++;
      }
    }

    return count > 0 ? attributeNames : undefined;
  }

  toExpressionAttributeValues(expressions: string[] = []): Record<string, AttributeValue> {
    const attributeValues: Record<string, AttributeValue> = {};
    let count = 0;

    // Build a unique token set using the expression attribute value placeholder
    const tokens = new Set<string>(expressions.flatMap((expr) => expr?.match(/:v\d+/g) || []));
    for (const [key, value] of this.#values.entries()) {
      // Only add the map key if it exists in the expression
      if (tokens.has(key)) {
        attributeValues[key] = marshall(value) as unknown as AttributeValue;
        count++;
      }
    }

    return count > 0 ? attributeValues : undefined;
  }

  #insertName(name: string) {
    if (this.#names.has(name)) {
      return this.#names.get(name);
    } else {
      const key = this.#uniqueName();
      this.#names.set(name, key);

      return key;
    }
  }

  #insertValue(value: any) {
    const key = this.#uniqueValue();
    this.#values.set(key, value);

    return key;
  }

  #uniqueName() {
    return `#n${this.#counter++}`;
  }

  #uniqueValue() {
    return `:v${this.#counter++}`;
  }
}
