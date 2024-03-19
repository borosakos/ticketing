import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app"; 
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@aboros-tickets/common";
import { natsWrapper } from "../../natsWrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  // Given
  const ticket = Ticket.build({
    price: 200,
    title: "ticket-title"
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "asfsgs",
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  // When
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    // Then
    .expect(400);
});

it("reserves a ticket", async () => {
  // Given
  const ticket = Ticket.build({
    price: 200,
    title: "ticket-title"
  });
  await ticket.save();

  // When
  const result = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    // Then
    .expect(201);
});

it("emits an order created event", async () => {
  // Given
  const ticket = Ticket.build({
    price: 200,
    title: "ticket-title"
  });
  await ticket.save();

  // When
  const result = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    // Then
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
