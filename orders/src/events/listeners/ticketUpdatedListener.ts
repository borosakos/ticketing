import { Message } from "node-nats-streaming";

import { Subjects, Listener, TicketUpdatedEvent } from "@aboros-tickets/common";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error("Ticket not found");
      //TODO
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack()
  }
}
