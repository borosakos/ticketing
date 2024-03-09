import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";


const createTicket = () => {
  return request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "asdfk",
      price: 20
    });
};

it("can featch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get("/api/tickets")
    .send()
    .expect(200);

  expect(response.body).toHaveLength(3);
});
