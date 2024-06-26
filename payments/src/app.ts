import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@aboros-tickets/common";
import { CreateChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
  })
);
app.use(currentUser);

app.use(CreateChargeRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
