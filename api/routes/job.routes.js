import express from "express";
import jobControllers from "../controllers/job.controllers.js";
const router = express.Router();

//get all jobs
router.get("/jobs", jobControllers.findAllJobs);

//get job by id
router.get("/jobs:id", jobControllers.findJobById);

//update a job
router.put("/jobs:id", jobControllers.updateJob);

//delete a job
router.delete("/jobs:id", jobControllers.deleteJob);
