import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to POST /api/tickets", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .send({});

  expect(response.status).not.toEqual(404);
});

it("can only be access if the user is signed in", async () => {
  await request(app)
    .post("/api/tickets")
    .send({})
    .expect(401);
});

it("return a status other tha 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("return an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "title",
      price: -1
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "title",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  
});