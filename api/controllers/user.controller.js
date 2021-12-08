import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";

//register controller
export const register = async (req, res) => {
  let newUser = new User({
    username: req.body.username,
    email: req.body.username,
    password: bcryptjs.hashSync(req.body.password, 10),
  });
  try {
    newUser.save().then((user) => {
      res.status(200).send("Registered successfully!");
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const login = async (req, res) => {
  let user = User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send("User Not Found!");
  }

  let passwordIsValid = bcryptjs.compareSync(req.body.password, user.password);
  if (!passwordIsValid) {
    res.status(401).send({
      accessToken: null,
      message: "Invalid emial or password",
    });
  }

  let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: 86400,
  });

  res.status(200).send({
    id: user._id,
    username: user.username,
    email: user.email,
    accessToken: token,
  });
};
