import DynamoDB from "aws-sdk/clients/dynamodb";
import _ from "lodash";
import { port } from "../jest-dynamodb-config";
import { DynamoClientV2 } from "../src/client/v2";
import { Table } from "../src/table";
import User from "./data/User";

const config = {
  endpoint: `http://localhost:${port}`,
  sslEnabled: false,
  region: "local",
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
};
const dynamodb: DynamoDB = new DynamoDB(config);
const documentClient: DynamoDB.DocumentClient = new DynamoDB.DocumentClient(config);
export const seedData = _.times(10, (n) => new User({ username: `user_${n}` }));
export const table: Table<User> = new Table<User>({
  client: new DynamoClientV2(dynamodb),
  table: {
    name: "Users",
    partitionKey: "userId",
  },
});

beforeAll(async () => {
  await seed(...seedData);
});

async function seed(...users: User[]) {
  const promises = users.map((user) => documentClient.put({ TableName: "Users", Item: user }).promise());
  await Promise.all(promises);
}
