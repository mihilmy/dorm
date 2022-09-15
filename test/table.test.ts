import User from "./data/User";
import { table, seedData } from "./setup";

it("reads all entries seeded", async () => {
  const storedUsers = await table.read().all();
  expect(storedUsers).toHaveLength(seedData.length);
});

it("reads one entry seeded via GSI", async () => {
  const storedUser = await table.read({ username: "user_2"}).one();
  expect(storedUser).toBeDefined();
  expect(storedUser.username).toBe("user_2");
});

it("writes new entry", async () => {
  const newUser = new User({ username: "omar" });
  const userId = newUser.userId;

  // Write and read back
  await table.create(newUser).run();
  const storedUser = await table.read({ userId }).one();
  
  expect(storedUser).toEqual(newUser);
});