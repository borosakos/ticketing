import  { Publisher, Subjects, TicketCreatedEvent } from "@aboros-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
