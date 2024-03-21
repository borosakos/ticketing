import mongoose from "mongoose";

import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../natsWrapper";
import { OrderCreatedListener } from "../orderCreatedListener";
import { OrderCreatedEvent, OrderStatus } from "@aboros-tickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "title",
    price: 200,
    userId: "23453532"
  });
  await ticket.save();

  const event: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, event, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, event, msg } = await setup();

  await listener.onMessage(event, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(event.id);
});

it("acks the message", async () => {
  const { listener, ticket, event, msg } = await setup();

  await listener.onMessage(event, msg);

  await Ticket.findById(ticket.id);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});
