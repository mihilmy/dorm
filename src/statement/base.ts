import * as Conditions from "../conditions";

export abstract class Statement<T> {
  protected from: { table: string; index?: string };
  private projection: string[];
  private condition: string[];
  protected conditionalOperator: "AND" | "OR" = "AND";

  constructor(table: string) {
    this.from = { table };
    this.projection = [];
    this.condition = [];
  }

  // INTERMEDIATE METHODS

  protected useConditionModifier(path: Extract<keyof T, "string">, operator: string, value: any) {
    switch (operator) {
      case "<":
      case "<=":
      case "<>":
      case "=":
      case ">":
      case ">=":
        this.commitCondition(Conditions.comparison({ path, value, comparator: operator }));
        break;
      case "BETWEEN":
        this.commitCondition(Conditions.between({ path, lowerBound: value[0], upperBound: value[1] }));
        break;
      case "BEGINS_WITH":
        this.commitCondition(Conditions.beginsWith({ path, substring: value }));
        break;
      case "CONTAINS":
        this.commitCondition(Conditions.contains({ path, value }));
        break;
      case "IS MISSING":
        this.commitCondition(Conditions.isMissing({ path }));
        break;
      case "IS NOT MISSING":
        this.commitCondition(Conditions.isNotMissing({ path }));
        break;
      case "IS NULL":
        this.commitCondition(Conditions.isNull({ path }));
        break;
      case "IS NOT NULL":
        this.commitCondition(Conditions.isNotNull({ path }));
        break;
      case "IN":
        this.commitCondition(Conditions.includes({ path, values: value }));
        break;
      default:
        throw new Error("Invalid comparator operator");
    }
  }

  protected commitCondition(condition: string) {
    const length = this.condition.length;
    if (length === 0) {
      this.condition.push(condition);
    } else {
      this.condition.push(this.conditionalOperator);
      this.condition.push(condition);
    }
  }

  // BUILDER FUNCTIONS

  abstract buildStatement(): string;

  protected buildFromClause() {
    const baseClause = `FROM "${this.from.table}"`;
    if (this.from.index) {
      return `${baseClause}."${this.from.index}"`;
    }

    return baseClause;
  }

  protected buildWhereClause() {
    if (this.condition.length === 0) {
      return "";
    }

    return `WHERE ${this.condition.join(" ")}`;
  }

  protected buildProjection() {
    if (this.projection.length === 0) {
      return "*";
    }

    return this.projection.join(", ");
  }
}

export type Path<T> = keyof T
export type Scalar = string | number;
export type Operator =
  | "<"
  | "<="
  | "<>"
  | "="
  | ">"
  | ">="
  | "BETWEEN"
  | "NOT BETWEEN"
  | "BEGINS_WITH"
  | "NOT BEGINS_WITH"
  | "CONTAINS"
  | "NOT CONTAINS"
  | "IN"
  | "NOT IN"
  | "IS MISSING"
  | "IS NOT MISSING"
  | "IS NULL"
  | "IS NOT NULL"
