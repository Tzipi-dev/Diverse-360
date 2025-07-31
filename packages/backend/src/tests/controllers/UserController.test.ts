/// tests/controllers/UserController.test.ts
import supertest from "supertest";
import express from "express";
import { userController } from "../../controllers/UserController";
import * as userServiceModule from "../../services/UserService";
import bcrypt from "bcryptjs";
import { User } from "../../models/UserModel";

const app = express();
app.use(express.json());
app.post("/login", (req, res) => userController.login(req, res));

const mockUser: User = {
  id: "user123",
  email: "test@test.com",
  password: bcrypt.hashSync("123456", 10),
  firstName: "Test",
  lastName: "User",
  role: "manager", // ✅ חייב להיות 'manager' או 'student'
  createdAt: new Date(), // ✅ Date, לא מחרוזת
  phone: "0501234567",   // אופציונלי
};

describe("UserController - login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should login successfully", async () => {
    jest.spyOn(userServiceModule.userService, "getUserByEmail").mockResolvedValue(mockUser);

    const res = await supertest(app)
      .post("/login")
      .send({ email: "test@test.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 401 for wrong email", async () => {
    jest.spyOn(userServiceModule.userService, "getUserByEmail").mockResolvedValue(null);

    const res = await supertest(app)
      .post("/login")
      .send({ email: "wrong@test.com", password: "123456" });

    expect(res.status).toBe(401);
  });

  it("should return 401 for wrong password", async () => {
    jest.spyOn(userServiceModule.userService, "getUserByEmail").mockResolvedValue(mockUser);

    const res = await supertest(app)
      .post("/login")
      .send({ email: "test@test.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });
});
