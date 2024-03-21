
import mongoose from "mongoose";

import { natsWrapper } from "../../../natsWrapper";
import { TicketUpdatedEvent } from "@aboros-tickets/common";
import { Message } from "node-nats-streaming";
import { TicketUpdatedListener } from "../ticketUpdatedListener";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // creat a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title",
    price: 200
  });
  await ticket.save();

  // create a fake event
  const event: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new title",
    price: 400,
    userId: new mongoose.Types.ObjectId().toHexString()
  };

  // create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, event, ticket, msg };
};

it("finds, updates and saves the ticket", async () => {
  const { msg, event, ticket, listener } = await setup();
  
  await listener.onMessage(event, msg);

  const updateTicket = await Ticket.findById(ticket.id);

  expect(updateTicket!.title).toEqual(event.title);
  expect(updateTicket!.price).toEqual(event.price);
  expect(updateTicket!.version).toEqual(event.version);
});

it("acks the message", async () => {
  const { msg, event, ticket, listener } = await setup();
  
  await listener.onMessage(event, msg);

  await Ticket.findById(ticket.id);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});

it("does not call ack it the event has a skipped version number", async () => {
  const { msg, event, ticket, listener } = await setup();

  event.version = 10;

  try {
    await listener.onMessage(event, msg);
  } catch (err) { }

  expect(msg.ack).not.toHaveBeenCalled();
});
