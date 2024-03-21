import mongoose from "mongoose";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../natsWrapper";
import { OrderCancelledListener } from "../orderCancelledListener";
import { OrderCancelledEvent } from "@aboros-tickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "title",
    price: 20,
    userId: "23453532"
  });
  ticket.set({ orderId });
  await ticket.save();

  const event: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
        id: ticket.id,
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, orderId, ticket, event, msg };
};

it("updates the ticket, publishes an event and acks the message", async () => {
  const { listener, orderId, ticket, event, msg } = await setup();

  await listener.onMessage(event, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
