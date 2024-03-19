import { Publisher, OrderCancelledEvent, Subjects } from "@aboros-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
