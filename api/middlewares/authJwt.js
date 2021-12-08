import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Unauthorized" });
    }
    req._id = decoded._id;
    next();
  });
};

export default verifyToken;
