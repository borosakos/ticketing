import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@aboros-tickets/common";

import { CreateOrderRouter } from "./routes/new";
import { ShowOrderRouter } from "./routes/show";
import { IndexOrderRouter } from "./routes/index";
import { DeleteOrderRouter } from "./routes/delete";

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

app.use(CreateOrderRouter);
app.use(ShowOrderRouter);
app.use(IndexOrderRouter);
app.use(DeleteOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
