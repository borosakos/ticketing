import { Message } from "node-nats-streaming"; 

import { Listener } from "./baseListener";
import { TicketCreatedEvent } from "./ticketCreatedEvent";
import { Subjects } from "./subjects";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event received!", data);
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    
    msg.ack();
  }
}
