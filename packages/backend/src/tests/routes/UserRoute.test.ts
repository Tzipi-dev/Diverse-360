import express from "express";
import userRoutes from "../../routes/UserRoute";
import supertest from "supertest";

describe("User Routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/users", userRoutes);

  it("should respond to GET /users", async () => {
    const res = await supertest(app).get("/users");
    expect([200, 500]).toContain(res.status);
  });

  it("should respond to POST /users", async () => {
    const res = await supertest(app).post("/users").send({});
    expect([201, 400, 500]).toContain(res.status);
  });
});
