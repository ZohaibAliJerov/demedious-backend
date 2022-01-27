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
  let { title, levels, positions, republics, cities, months } = req.body;
  //levels,positions,locations are arrays
  //remove undefined parameters
  
  let jobs = [];
  if (
    title &&
    levels != undefined &&
    positions != undefined &&
    republics != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    positions != undefined &&
    republics != undefined &&
    cities != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
      city: { $in: cities },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    positions != undefined &&
    republics != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    positions != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    republics != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      levels: { $in: levels },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    positions != undefined &&
    republics != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    levels != undefined &&
    positions != undefined &&
    republics != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    positions != undefined &&
    republics != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    positions != undefined &&
    cities != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    republics != undefined &&
    cities != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      republic: { $in: republics },
      city: { $in: cities },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    positions != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    positions != undefined &&
    republics != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      republic: { $in: republics },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    positions != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    republics != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    positions != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
    });
  } else if (title != undefined && levels != undefined && cities != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      city: { $in: cities },
    });
  } else if (
    title != undefined &&
    levels != undefined &&
    republics != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      republic: { $in: republics },
    });
  } else if (title != undefined && levels != undefined && months != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    positions != undefined &&
    cities != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      city: { $in: cities },
    });
  } else if (
    title != undefined &&
    positions != undefined &&
    republics != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      republic: { $in: republics },
    });
  } else if (
    title != undefined &&
    positions != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    cities != undefined &&
    republics != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
      republic: { $in: republics },
    });
  } else if (title != undefined && cities != undefined && months != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    title != undefined &&
    republics != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      republic: { $in: republics },
      month: { $in: months },
    });
  } else if (
    levels != undefined &&
    positions != undefined &&
    cities != undefined
  ) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
    });
  } else if (
    levels != undefined &&
    positions != undefined &&
    republics != undefined
  ) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
    });
  } else if (
    levels != undefined &&
    positions != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      month: { $in: months },
    });
  } else if (
    levels != undefined &&
    cities != undefined &&
    republics != undefined
  ) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
      republic: { $in: republics },
    });
  } else if (
    levels != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    levels != undefined &&
    republics != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      level: { $in: levels },
      republic: { $in: republics },
      month: { $in: months },
    });
  } else if (
    positions != undefined &&
    cities != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (
    positions != undefined &&
    republics != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      position: { $in: positions },
      republic: { $in: republics },
      month: { $in: months },
    });
  } else if (
    cities != undefined &&
    republics != undefined &&
    months != undefined
  ) {
    jobs = await Job.find({
      city: { $in: cities },
      republic: { $in: republics },
      month: { $in: months },
    });
  } else if (title != undefined && levels != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
    });
  } else if (title != undefined && positions != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
    });
  } else if (title != undefined && cities != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
    });
  } else if (title != undefined && republics != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      republic: { $in: republics },
    });
  } else if (title != undefined && months != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      month: { $in: months },
    });
  } else if (levels != undefined && positions != undefined) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
    });
  } else if (levels != undefined && cities != undefined) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
    });
  } else if (levels != undefined && republics != undefined) {
    jobs = await Job.find({
      level: { $in: levels },
      republic: { $in: republics },
    });
  } else if (levels != undefined && months != undefined) {
    jobs = await Job.find({
      level: { $in: levels },
      month: { $in: months },
    });
  } else if (positions != undefined && cities != undefined) {
    jobs = await Job.find({
      position: { $in: positions },
      city: { $in: cities },
    });
  } else if (positions != undefined && republics != undefined) {
    jobs = await Job.find({
      position: { $in: positions },
      republic: { $in: republics },
    });
  } else if (positions != undefined && months != undefined) {
    jobs = await Job.find({
      position: { $in: positions },
      month: { $in: months },
    });
  } else if (cities != undefined && republics != undefined) {
    jobs = await Job.find({
      city: { $in: cities },
      republic: { $in: republics },
    });
  } else if (cities != undefined && months != undefined) {
    jobs = await Job.find({
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (republics != undefined && months != undefined) {
    jobs = await Job.find({
      republic: { $in: republics },
      month: { $in: months },
    });
  } else if (republics != undefined && cities != undefined) {
    jobs = await Job.find({
      republic: { $in: republics },
      city: { $in: cities },
    });
  } else if (title != undefined) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
    });
  } else if (levels != undefined) {
    jobs = await Job.find({
      level: { $in: levels },
    });
  } else if (positions != undefined) {
    jobs = await Job.find({
      position: { $in: positions },
    });
  } else if (cities != undefined) {
    jobs = await Job.find({
      city: { $in: cities },
    });
  } else if (republics != undefined) {
    jobs = await Job.find({
      republic: { $in: republics },
    });
  } else if (months != undefined) {
    jobs = await Job.find({
      month: { $in: months },
    });
  } else {
    res.status(200).send({
      message: "No valid search parameters provided",
    });
    // return res.status(200).send(req);
  }
  try {
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
