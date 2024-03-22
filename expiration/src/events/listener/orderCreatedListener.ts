import { Message } from "node-nats-streaming";

import { Listener, OrderCreatedEvent, Subjects } from "@aboros-tickets/common";
import { queueGroupName } from "./queueGroupName";
import { expirationQueue } from "../../queues/expirationQueue";

export class OrderCreatedListenet extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  
  async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
    await expirationQueue.add({
      orderId: data.id
    });

    msg.ack();
  }
};
