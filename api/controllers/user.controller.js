import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";
import Token from "../models/Token.js";
import { registerValidation, loginValidation } from "../validation.js";

//register controller
export const register = async (req, res) => {
  //validate user data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let salt = bcryptjs.genSaltSync(10);
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcryptjs.hashSync(req.body.password, salt),
  });
  try {
    newUser.save().then((user) => {
      return res.status(200).send("Registered successfully!");
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

export const login = async (req, res) => {
  //validate user data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

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

      if (result) {
        let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
          expiresIn: 86400,
        });
        //save token
        let newToken = new Token({
          userId: user._id,
          token: token,
        });
        newToken.save().then((token) => {
          try {
            return res.status(200).send({
              accessToken: token.token,
              message: "Login successfully!",
            });
          } catch (err) {
            return res.status(500).send({ message: err.message });
          }
        });
      } else {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid email or password",
        });
      }
    });
  }
};

export const logout = async (req, res) => {
  try {
    let token = req.header("auth-token");
    let decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    let userId = decoded._id;
    await Token.findOneAndDelete({ userId: userId });
    return res.status(200).send({ message: "Logout successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
