export abstract class Statement {
  private from: { table: string; index?: string };
  private projection: string[];
  private condition: string[];
  private conditionalOperator: "AND" | "OR" = "AND";

  constructor(table: string) {
    this.from = { table };
    this.projection = [];
    this.condition = [];
  }

  // INTERMEDIATE METHODS

  protected addCondition(condition: string) {
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
