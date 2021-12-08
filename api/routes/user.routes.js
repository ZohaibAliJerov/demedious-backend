import { register, login } from "../controllers/user.controller.js";
import verifySignUp from "../middlewares/verifySignup.js";

import express from "express";
const router = express.Router();

router.post("/signup", [verifySignUp], register);

router.post("/login", login);

export default router;
