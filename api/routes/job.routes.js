import express from "express";
import verifyToken from "../middlewares/authJwt.js";
import {
  findAllJobs,
  findJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJob,
  saveJob,
  getSavedJobs,
} from "../controllers/job.controllers.js";
const router = express.Router();

//get all jobs
router.get("/all", [verifyToken], findAllJobs);

//create a job
router.post("/create", [verifyToken], createJob);
//get job by id
router.get("/:id", [verifyToken], findJobById);

//update a job
router.put("/:id", [verifyToken], updateJob);

//delete a job
router.delete("/:id", [verifyToken], deleteJob);

//search and filter jobs
router.post("/search", searchJob);
export default router;
