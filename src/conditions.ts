import stringify from "./utils/stringify";

export function comparison({ path, value, comparator }: { path: string; value: string; comparator: string }) {
  return `${path} ${comparator} ${stringify(value)}`;
}

export function isMissing({ path }: { path: string }) {
  return `${path} IS MISSING`;
}

export function isNotMissing({ path }: { path: string }) {
  return `${path} IS NOT MISSING`;
}

export function isNull({ path }: { path: string }) {
  return `${path} IS NULL`;
}

export function isNotNull({ path }: { path: string }) {
  return `${path} IS NOT NULL`;
}

export function beginsWith({ path, substring }: { path: string; substring: string }) {
  return `begins_with(${path}, ${stringify(substring)})`;
}

export function includes({ path, values }: { path: string; values: (string | number)[] }) {
  return `${path} IN ${stringify(values)}`;
}

export function contains({ path, value }: { path: string; value: string | number }) {
  return `contains(${path}, ${stringify(value)})`;
}

export function attributeType({ path, type }: { path: string; type: string }) {
  return `attribute_type(${path}, ${stringify(type)})`;
}

export function between({
  path,
  lowerBound,
  upperBound,
}: {
  path: string;
  lowerBound: string | number;
  upperBound: string | number;
}) {
  return `${path} BETWEEN ${stringify(lowerBound)} AND ${stringify(upperBound)}`;
}
