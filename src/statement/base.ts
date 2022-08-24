export abstract class Statement {
  private from: { table: string; index?: string };
  private projection: string[];
  private condition: string[];

  constructor(table: string) {
    this.from = { table };
    this.projection = [];
    this.condition = [];
  }

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
