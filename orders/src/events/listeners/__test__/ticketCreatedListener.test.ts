
import mongoose from "mongoose";

import { TicketCreatedListener } from "../ticketCreatedListener";
import { natsWrapper } from "../../../natsWrapper";
import { TicketCreatedEvent } from "@aboros-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = () => {
  // creat a listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake event
  const event: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "title",
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString()
  };

  // create a fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, event, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, event, msg } = setup();

  // call the onMessage function with thedata object and message object
  await listener.onMessage(event, msg);

  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(event.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(event.title);
  expect(ticket!.price).toEqual(event.price);
});

it("acks the message", async () => {
  const { listener, event, msg } = setup();

  // call the onMessage function with thedata object and message object
  await listener.onMessage(event, msg);

  // write assertions to make sure ack function is called
  await Ticket.findById(event.id);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});
