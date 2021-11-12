import JobContrller from "../controllers/job.controllers.js";
import express from "express";
import jobControllers from "../controllers/job.controllers.js";
const router = express.Router();

//get all jobs
router.get("/jobs", jobControllers.findAllJobs);
