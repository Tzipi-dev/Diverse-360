import { userService } from "../../services/UserService";

jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: jest.fn(() => ({
      from: jest.fn(() => ({
        select: jest.fn(() => ({ data: [], error: null })),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn(() => ({ data: null, error: null })),
        insert: jest.fn(() => ({ error: null })),
        update: jest.fn(() => ({ select: jest.fn(() => ({ data: {}, error: null })), single: jest.fn() })),
        delete: jest.fn(() => ({ error: null })),
      })),
    })),
  };
});

describe("UserService", () => {
  it("getAllUsers should return an empty array", async () => {
    const users = await userService.getAllUsers();
    expect(users).toEqual([]);
  });

  it("getUserById should return null", async () => {
    const user = await userService.getUserById("fakeId");
    expect(user).toBeNull();
  });
});