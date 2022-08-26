export default function stringify(value: any) {
  if (value === null) {
    return "NULL";
  }

  if (typeof value === "string") {
    return `'${value.replace(/'/g, "''")}'`;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  if (Array.isArray(value)) {
    return `[${value.map((v) => stringify(v)).join(",")}]`;
  }

  if (value instanceof Set) {
    // prettier-ignore
    return `<<${Array.from(value).map((v) => stringify(v)).join(", ")}>>`;
  }

  if (value instanceof Date) {
    return stringify(value.toISOString());
  }

  if (value instanceof Map) {
    let object = "{ ";
    const lastKey = [...value.keys()].pop();

    for (const [k, v] of value) {
      object += `${stringify(k)}: ${stringify(v)}`;
      if (k !== lastKey) {
        object += ", ";
      }
    }

    return (object += " }");
  }

  if (typeof value === "object") {
    let object = "{ ";
    const lastKey = Object.keys(value).pop();

    for (const [k,v] of Object.entries(value)) {
      object += `${stringify(k)}: ${stringify(v)}`;
      if (k !== lastKey) {
        object += ", ";
      }
    }

    return (object += " }");
  }

  return "";
}
