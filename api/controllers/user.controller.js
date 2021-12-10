import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";

//register controller
export const register = async (req, res) => {
  let salt = bcryptjs.genSaltSync(10);
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcryptjs.hashSync(req.body.password, salt),
  });
  try {
    newUser.save().then((ueaser) => {
      return res.status(200).send("Registered successfully!");
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

export const login = async (req, res) => {
  let user;

  if (Object.keys(req.body).includes("username")) {
    user = await User.findOne({ username: req.body.username });
  } else if (Object.keys(req.body).includes("email")) {
    user = await User.findOne({ email: req.body.email });
  }

  if (!user) {
    return res.status(404).send("User Not Found!");
  } else {
    bcryptjs.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid email or password",
        });
      }
      let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: 86400,
      });
      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token,
      });
    });
  }
};
