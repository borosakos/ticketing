import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

import { requireAuth, validateRequest } from "@aboros-tickets/common";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided!")
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as CreateOrderRouter };
