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
  let { title, levels, positions, locations, cities } = req.body;
  //levels,positions,locations are arrays

  let jobs;
  //if all the search fields are there
  if (title && levels && positions && locations && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
      city: { $in: cities },
    });
  }
  //if title levels positions locations are there
  if (title && levels && positions && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
    });
  }
  //if title levels positions and citites are there
  if (title && levels && positions && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
    });
  }
  //if title levels locations and cities are there
  if (title && levels && locations && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      location: { $in: locations },
      city: { $in: cities },
    });
  }
  //if title positions locations and cities are there
  if (title && positions && locations && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      location: { $in: locations },
      city: { $in: cities },
    });
  }
  //if title positions levels and cities are there
  if (title && positions && levels && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      level: { $in: levels },
      city: { $in: cities },
    });
  }
  //if levels positions locations and cities are there
  if (levels && positions && locations && cities) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
      city: { $in: cities },
    });
  }
  //if title levels and locations are there
  if (title && levels && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      location: { $in: locations },
    });
  }
  //if title positions and locations are there
  if (title && positions && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      location: { $in: locations },
    });
  }

  //if title positions and levels are there
  if (title && positions && levels) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      level: { $in: levels },
    });
  }
  //if title locations and levels are there
  if (title && locations && levels) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      location: { $in: locations },
      level: { $in: levels },
    });
  }
  //if title locations and positions
  if (title && locations && positions) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      location: { $in: locations },
      position: { $in: positions },
    });
  }

  if (levels && positions && locations) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
    });
  }
  if (levels && positions && cities) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
    });
  }
  if (levels && locations && cities) {
    jobs = await Job.find({
      level: { $in: levels },
      location: { $in: locations },
      city: { $in: cities },
    });
  }
  if (positions && locations && cities) {
    jobs = await Job.find({
      position: { $in: positions },
      location: { $in: locations },
      city: { $in: cities },
    });
  }
  //if title and levels are there
  if (title && levels) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
    });
  }
  //if title and positions are there
  if (title && positions) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
    });
  }
  //if title and locations are there
  if (title && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      location: { $in: locations },
    });
  }
  //if title and cities are there
  if (title && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
    });
  }
  if (levels && positions) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
    });
  }
  if (levels && locations) {
    jobs = await Job.find({
      level: { $in: levels },
      location: { $in: locations },
    });
  }
  if (levels && cities) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
    });
  }
  if (positions && locations) {
    jobs = await Job.find({
      position: { $in: positions },
      location: { $in: locations },
    });
  }
  if (positions && cities) {
    jobs = await Job.find({
      position: { $in: positions },
      city: { $in: cities },
    });
  }
  if (locations && cities) {
    jobs = await Job.find({
      location: { $in: locations },
      city: { $in: cities },
    });
  }
  if (levels) {
    jobs = await Job.find({
      level: { $in: levels },
    });
  }
  if (positions) {
    jobs = await Job.find({
      position: { $in: positions },
    });
  }
  if (locations) {
    jobs = await Job.find({
      location: { $in: locations },
    });
  }
  if (cities) {
    jobs = await Job.find({
      city: { $in: cities },
    });
  }
  if (title) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
    });
  }

  try {
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
