import express, { Request, Response } from "express"
import { body } from "express-validator";

import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@aboros-tickets/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token")
      .not()
      .isEmpty(),
    body("orderId")
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {    
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (req.currentUser!.id !== order.userId) {
      throw new NotAuthorizedError();
    }
    if (order.status == OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order!");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token
    });

    const payment = Payment.build({
      orderId: order.id,
      chargeId: charge.id
    });
    await payment.save();

    return res.status(201).send({ success: true });
  }
);

export { router as CreateChargeRouter };
