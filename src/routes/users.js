import express from "express";
import mockedUsers from "../utils/mockedUsers.js";
import {
  createUserValidationSchema,
  queryParamsValidationSchema,
} from "../utils/validationSchemas.js";
import resolveIndexByUserId from "../utils/resolveUserIndexById.js";
import {
  query,
  body,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { User } from "../mongoose/schemas/user.js";
import { hashPassword } from "../utils/helpers.js";

const router = express();

router.get(
  "/api/users",
  checkSchema(queryParamsValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    const {
      query: { filter, value },
    } = request;
    //if (filter && value) return response.send(
    //  mockedUsers.filter((user) => user[filter].includes(value))
    //);
    const users = await User.find();
    return response.send(users);
  }
);

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return response.status(201).send(savedUser);
    } catch (error) {
      console.log(error);
      return response.sendStatus(400);
    }
  }
);

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockedUsers.find(
    (user) => user.id === mockedUsers[findUserIndex].id
  );
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockedUsers[findUserIndex] = { id: mockedUsers[findUserIndex].id, ...body };
  response.status(204).send(mockedUsers[request.findUserIndex]);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockedUsers[findUserIndex] = { ...mockedUsers[findUserIndex], ...body };
  return response.status(200).send(mockedUsers[request.findUserIndex]);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockedUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
