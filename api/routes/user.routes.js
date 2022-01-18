import {
  register,
  login,
  logout,
  saveJob,
  getSavedJobs,
} from "../controllers/user.controller.js";
import verifySignUp from "../middlewares/verifySignup.js";

import express from "express";
const router = express.Router();

router.post("/signup", [verifySignUp], register);

router.post("/signin", login);

router.get("/logout", logout);

router.post("/saveJob", saveJob);

router.get("/getSavedJobs", getSavedJobs);
export default router;
