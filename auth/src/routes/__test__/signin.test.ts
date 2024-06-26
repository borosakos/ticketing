import request from "supertest";
import { app } from "../../app";

it("returns a 400 with missing credentials", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      "email": "invalid-email-address",
      "password": "password" 
    })
    .expect(400);

  await request(app)
    .post("/api/users/signin")
    .send({
      "email": "invalid-email-address",
      "password": ""
    })
    .expect(400);

  await request(app)
    .post("/api/users/signin")
    .send({
      "email": "invalid-email-address",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      "email": "test@example.com",
      "password": "password" 
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      "email": "test@example.com",
      "password": "password" 
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
