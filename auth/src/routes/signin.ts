import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router()

router.post("/api/users/signin", [
  body("email")
    .isEmail()
    .withMessage("Please, provide a valid email address!"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please, provide your password!")
  ],
  validateRequest,
  async (req: Request, res: Response) => { 
    const { email, password } = req.body;
    res.send(200);
  }
);

export { router as signinRouter }
