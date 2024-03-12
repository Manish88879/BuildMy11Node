import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"]
    .replace("Bearer ", "")
    .replace("Bearer ", "");

    const accessTokenSecret = process.env.TOKEN_KEY;

  if (!token) return res.status(401).send("Unauthorized");

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).send("Unauthorized");
      }
      req.user = user; // Store the user object in the request
    });
  next();
};

export default jwtAuth;
