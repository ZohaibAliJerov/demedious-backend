import User from "../models/User.model.js";

const checkUsernameOrEmailExists = (req, res, next) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (user) {
      return res.status(400).send({ message: "username already exists!" });
    }
    User.findOne({ email: req.body.email }).exec((err, user) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (user) {
        return res.status(400).send({ message: "email alreay exists!" });
      }
      next();
    });
  });
};

export default checkUsernameOrEmailExists;
