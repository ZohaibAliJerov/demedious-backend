import express from "express";
import {
  requestResetLink,
  resetPassword,
} from "../controllers/resetPassword.controllers.js";
const router = express.Router();

router.post("/", requestResetLink);

router.post("/:userId/:token", resetPassword);

export default router;
