export default interface Key {
  type: "GSI" | "LSI" | "PRIMARY";
  partitionKey: string;
  sortKey?: string;
}