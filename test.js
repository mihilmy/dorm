const DynamoDB = require("aws-sdk/clients/dynamodb");

const entries = times(100, (i) => ({ id: i.toString().padStart(3, "0"), index: i }));

function buildPutRequest(entry) {
  return { PutRequest: { Item: entry } };
}

function times(n, fn) {
  let i = 0;
  const arr = [];
  while (i < n) {
    arr.push(fn(i));
    i++;
  }
  return arr;
}

function chunk(arr, fn, size = 25) {
  const chunked_arr = [];
  let index = 0;
  while (index < arr.length) {
    chunked_arr.push(arr.slice(index, index + size).map(fn));
    index += size;
  }
  return chunked_arr;
}

function seed() {
  const chunks = chunk(entries, buildPutRequest, 25);
  const docClient = new DynamoDB.DocumentClient({ region: "us-west-2" });
  const promises = chunks.map((request) => docClient.batchWrite({ RequestItems: { Table1: request } }).promise());
  return Promise.all(promises).then(() => console.log("done"));
}

function query() {
  const queryable = entries
    .slice(50, 70)
    .map((e) => `'${e.id}'`)
    .join(",");
  const dynamodb = new DynamoDB({ region: "us-west-2" });
  return dynamodb
    .executeStatement({
      Statement: `SELECT * FROM "Table1"
    WHERE "id" IN [${queryable}]`,
    })
    .promise();
}

query().then((data) => console.log(JSON.stringify(data, null, 2)));
