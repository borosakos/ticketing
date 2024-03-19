import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@aboros-tickets/common";
import { Order } from "../../models/order";

import { natsWrapper } from "../../natsWrapper";

it("marks an order as cancelled", async () => {
  // create a ticket 
  const ticket = Ticket.build({
    title: "title",
    price: 200
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
 // create a ticket 
  const ticket = Ticket.build({
    title: "title",
    price: 200
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  jest.resetAllMocks();
  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
