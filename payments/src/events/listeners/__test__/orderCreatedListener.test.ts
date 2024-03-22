import { OrderCreatedEvent, OrderStatus } from "@aboros-tickets/common";
import { natsWrapper } from "../../../natsWrapper"
import { OrderCreatedListener } from "../orderCreatedListener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const event: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, event, msg };
}

it("replicates the order info", async() => {
  const { listener, event, msg } = setup();

  await listener.onMessage(event, msg);

  const order = await Order.findById(event.id);

  expect(order!.price).toEqual(event.ticket.price);
});

it("acks the message", async() => {
  const { listener, event, msg } = setup();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});
