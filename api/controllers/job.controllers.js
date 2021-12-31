import Job from "../models/Job.model.js";

//get all jobs
export const findAllJobs = async (req, res) => {
  let jobs = await Job.find({});
  try {
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

//get job by id
export const findJobById = async (req, res) => {
  let job = await Job.findById({ _id: req.body._id });
  try {
    res.status(200).send(job);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

//create job

export const createJob = async (req, res) => {
  let newJobs = new Job(req.body);
  try {
    await newJobs.save();
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

export const searchJob = async (req, res) => {
  let { title, level, position, location } = req.body;

  let jobs;
  if (title && level && position && location) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $regex: level, $options: "i" },
      position: { $regex: position, $options: "i" },
      location: { $regex: location, $options: "i" },
    });
  }
  if (title && level && position) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $regex: level, $options: "i" },
      position: { $regex: position, $options: "i" },
    });
  }
  if (title && level && location) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $regex: level, $options: "i" },
      location: { $regex: location, $options: "i" },
    });
  }
  if (title && position && location) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $regex: position, $options: "i" },
      location: { $regex: location, $options: "i" },
    });
  }
  if (level && position && location) {
    jobs = await Job.find({
      level: { $regex: level, $options: "i" },
      position: { $regex: position, $options: "i" },
      location: { $regex: location, $options: "i" },
    });
  }
  if (title && level) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $regex: level, $options: "i" },
    });
  }
  if (title && position) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $regex: position, $options: "i" },
    });
  }
  if (title && location) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      location: { $regex: location, $options: "i" },
    });
  }
  if (level && position) {
    jobs = await Job.find({
      level: { $regex: level, $options: "i" },
      position: { $regex: position, $options: "i" },
    });
  }
  if (level && location) {
    jobs = await Job.find({
      level: { $regex: level, $options: "i" },
      location: { $regex: location, $options: "i" },
    });
  }
  if (position && location) {
    jobs = await Job.find({
      position: { $regex: position, $options: "i" },
      location: { $regex: location, $options: "i" },
    });
  }
  if (title) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
    });
  }
  if (level) {
    jobs = await Job.find({
      level: { $regex: level, $options: "i" },
    });
  }
  if (position) {
    jobs = await Job.find({
      position: { $regex: position, $options: "i" },
    });
  }
  if (location) {
    jobs = await Job.find({
      location: { $regex: location, $options: "i" },
    });
  }
  try {
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
