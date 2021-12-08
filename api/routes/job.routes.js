import express from "express";
import verifyToken from "../middlewares/authJwt.js";
import {
  findAllJobs,
  findJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controllers.js";
const router = express.Router();

//get all jobs
router.get("/all", [verifyToken], findAllJobs);

//get job by id
router.get("/:id", [verifyToken], findJobById);

//update a job
router.put("/:id", [verifyToken], updateJob);

//delete a job
router.delete("/:id", [verifyToken], deleteJob);

export default router;
