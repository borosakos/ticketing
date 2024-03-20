import express, { Request, Response } from "express";
import { body } from "express-validator";

import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from "@aboros-tickets/common";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../natsWrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });

    res.send(ticket);
});

export { router as UpdateTicketRouter };
