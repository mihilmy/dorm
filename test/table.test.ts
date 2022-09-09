import { table, seedData } from "./setup";

it("reads all entries seeded", async () => {
  const storedUsers = await table.read().all();
  expect(storedUsers).toHaveLength(seedData.length);
});

it("reads one entry seeded", async () => {
  // const storedUser = await table.read().where("username", "=", "user_2").one();
  // expect(storedUser).toBeDefined();
  // expect(storedUser.username).toBe("user_2");
});
