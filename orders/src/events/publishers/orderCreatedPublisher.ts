import { Publisher, OrderCreatedEvent, Subjects } from "@aboros-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
