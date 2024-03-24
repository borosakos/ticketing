import { PaymentCreatedEvent, Publisher, Subjects } from "@aboros-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
