import express from "express";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.json());

app.get("/api/users/currentuser", (req, res) => {
  res.send("Welcome!");
});

export default app;
