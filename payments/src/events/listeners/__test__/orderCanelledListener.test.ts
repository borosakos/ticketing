import mongoose from "mongoose";

import { OrderCancelledEvent, OrderStatus } from "@aboros-tickets/common";
import { natsWrapper } from "../../../natsWrapper"
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../orderCancelledListener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 20,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  const event: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, event, msg };
}

it("updates the order status to OrderCancelled", async() => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  const updatedOrder = await Order.findById(event.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async() => {
  const { listener, event, msg } = await setup();

  await listener.onMessage(event, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});
