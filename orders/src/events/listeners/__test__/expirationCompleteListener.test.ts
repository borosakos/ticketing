import mongoose from "mongoose";

import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../natsWrapper";
import { ExpirationCompleteListener } from "../expirationCompleteListener";
import { ExpirationCompleteEvent, OrderStatus } from "@aboros-tickets/common";
import { Message } from "node-nats-streaming";

const setUp = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title",
    price: 200
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "adsdfs",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const event: ExpirationCompleteEvent["data"] = { orderId: order.id };
  
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, order, event, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, event, msg } = await setUp();

  await listener.onMessage(event, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
  const { listener, order, event, msg } = await setUp();

  await listener.onMessage(event, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, event, msg } = await setUp();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});
