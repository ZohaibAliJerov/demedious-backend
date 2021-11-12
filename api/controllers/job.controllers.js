import mongoose from "mongoose";
import Job from "../models/job.model";
import express from "express";

//get all jobs
export const findAllJobs = async (req, res) => {
  let jobs = await Job.find();
  try {
    res.json(jobs);
  } catch (err) {
    res.send(err);
  }
};

//get job by id
export const findJobById = async (req, res) => {
  let job = await Job.findById(req.params.id);
  try {
    res.status(200).json(job);
  } catch (err) {
    res.send(err);
  }
};
