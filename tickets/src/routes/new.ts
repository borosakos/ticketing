import express, { Request, Response } from "express";
import { requireAuth } from "@aboros-tickets/common";

const router = express.Router();

router.post("/api/tickets", requireAuth, (req: Request, res: Response) => {
  res.send(200);
});

export { router as CreateTicketRouter }
