import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("returns a 404 if the ticket is nout found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({})
    .expect(404);
});

it("return the ticket if the ticket is found ", async () => {
  const title = "polyphia"
  const price = 200

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title, price
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
