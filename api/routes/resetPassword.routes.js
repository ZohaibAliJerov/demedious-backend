import express from "express";
import {
  checkUserExists,
  resetPassword,
} from "../controllers/resetPassword.controllers.js";
const router = express.Router();

router.post("/", checkUserExists);

router.post("/:userId/:token", resetPassword);

export default router;
