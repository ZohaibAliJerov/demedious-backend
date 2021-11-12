import Job from "../models/job.model";

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

//create job

export const createJob = async (req, res) => {
  let newJobs = new Job(req.body);
  try {
    let job = await newJobs.save();
    res.status(201).send("Job adde successfully!");
  } catch (err) {
    res.status(400).send(err);
  }
};

//update job
export const updateJob = async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send("Job updated successfully!");
  } catch (err) {
    res.status(400).send(err);
  }
};

//delete job
export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndRemove(req.params.id);
    res.status(200).send("Job deleted successfully!");
  } catch (err) {
    res.status(400).send(err);
  }
};
