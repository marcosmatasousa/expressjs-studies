import express from "express";
import usersRouter from "./routes/users.js";
import users from "./utils/mockedUsers.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local-strategy.js";

const app = express();

mongoose
  .connect("mongodb://localhost/Express")
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "um segredo aleatorio",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 3,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

app.get("/", (request, response) => {
  response.cookie("hello", "world", { maxAge: 30000, signed: true });
  request.session.visited = true;
  response.send({ msg: "Welcome to my API" });
});

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  response.sendStatus(200);
});

app.get("/api/auth/status", (request, response) => {
  console.log(request.session);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  const { body: item } = request;
  const { cart } = request.session;
  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  return response.status(201).send(cart);
});
