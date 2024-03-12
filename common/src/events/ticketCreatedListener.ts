import { Message } from "node-nats-streaming"; 

import { Listener } from "./baseListener";

class TicketCreatedListener extends Listener {
  readonly subject = "ticket:created";
  readonly queueGroupName = "payments-service";

  onMessage(data: any, msg: Message): void {
    console.log("Event received!", data);
    msg.ack();
  }
}
