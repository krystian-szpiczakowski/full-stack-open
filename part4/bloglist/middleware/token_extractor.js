const jwt = require("jsonwebtoken");

const extractUser = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(request.token, process.env.JWT_SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({error: "token invalid"});
    }
  } catch (error) {
    return next(error)
  }

  request.user = decodedToken;

  next();
};

module.exports = { extractUser };
