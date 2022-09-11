const PORT = 7777;
const TABLE_NAME = "Users";

/**
 * @type {import('@shelf/jest-dynamodb/lib').Config}')}
 */
module.exports = {
  port: PORT,
  tables: [
    {
      TableName: TABLE_NAME,
      KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" },
        { AttributeName: "username", AttributeType: "S" },
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
      GlobalSecondaryIndexes: [
        {
          IndexName: "username-index",
          KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: { ReadCapacityUnits: 10, WriteCapacityUnits: 10 },
        },
      ],
    },
  ],
  config: {
    endpoint: `localhost:${PORT}`,
    region: "local",
    sslEnabled: false,
    credentails: { accessKeyId: "fake", secretAccessKey: "fake" },
  },
};
