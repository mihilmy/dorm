import { table, seedData } from "./setup";

it("reads all entries seeded", async () => {
  const storedUsers = await table.read().all();
  expect(storedUsers).toHaveLength(seedData.length);
});

