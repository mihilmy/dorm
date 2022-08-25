import { nanoid } from "nanoid";

export default class User {
  userId: string;
  username: string;
  version: number;
  skills: Set<"Java" | "Typescript">;
  createdAt: string;
  locations: { country: string; city: string; votes: number; years: number }[];
  connections: Record<string, User>;

  constructor(user: Partial<User>) {
    this.userId = `user.id.${nanoid()}`;
    this.version = 1;
    this.createdAt = new Date().toISOString();
    this.locations = [];

    Object.assign(this, user);
  }
}