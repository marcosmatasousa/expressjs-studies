import users from './mockedUsers.js';

function resolveIndexByUserId(request, response, next) {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id)
  if (!parsedId) return response.sendStatus(400);
  const findUserIndex = users.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};

export default resolveIndexByUserId;