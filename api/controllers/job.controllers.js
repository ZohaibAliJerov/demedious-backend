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
  if (title) {
    title = title[0].toLowerCase();
  }

  //levels,positions,locations are arrays
  let jobs = [];
  if (title && levels && positions && republics && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && levels && positions && republics && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (title && levels && positions && republics && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && levels && positions && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && levels && republics && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      levels: { $in: levels },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && positions && republics && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (levels && positions && republics && cities && months) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && levels && positions && republics) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (title && levels && positions && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (title && levels && republics && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      republic: { $in: republics },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (title && levels && positions && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && levels && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && positions && republics && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      republic: { $in: republics },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && positions && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && republics && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      republic: { $in: republics },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && levels && positions) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
    }).sort({ date: 1 });
  } else if (title && levels && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (title && levels && republics) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (title && levels && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && positions && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (title && positions && republics) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (title && positions && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && cities && republics) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (title && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && republics && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      republic: { $in: republics },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (levels && positions && cities) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (levels && positions && republics) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (levels && positions && months) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (levels && cities && republics) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (levels && cities && months) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (levels && republics && months) {
    jobs = await Job.find({
      level: { $in: levels },
      republic: { $in: republics },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (positions && cities && months) {
    jobs = await Job.find({
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (positions && republics && months) {
    jobs = await Job.find({
      position: { $in: positions },
      republic: { $in: republics },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (cities && republics && months) {
    jobs = await Job.find({
      city: { $in: cities },
      republic: { $in: republics },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (title && levels) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
    }).sort({ date: 1 });
  } else if (title && positions) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
    }).sort({ date: 1 });
  } else if (title && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (title && republics) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (title && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (levels && positions) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
    }).sort({ date: 1 });
  } else if (levels && cities) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (levels && republics) {
    jobs = await Job.find({
      level: { $in: levels },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (levels && months) {
    jobs = await Job.find({
      level: { $in: levels },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (positions && cities) {
    jobs = await Job.find({
      position: { $in: positions },
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (positions && republics) {
    jobs = await Job.find({
      position: { $in: positions },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (positions && months) {
    jobs = await Job.find({
      position: { $in: positions },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (cities && republics) {
    jobs = await Job.find({
      city: { $in: cities },
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (cities && months) {
    jobs = await Job.find({
      city: { $in: cities },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (republics && months) {
    jobs = await Job.find({
      republic: { $in: republics },
      month: { $in: months },
    }).sort({ date: 1 });
  } else if (republics && cities) {
    jobs = await Job.find({
      republic: { $in: republics },
      city: { $in: cities },
    }).srot({ date: 1 });
  } else if (title) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
    }).sort({ date: 1 });
  } else if (levels) {
    jobs = await Job.find({
      level: { $in: levels },
    }).sort({ date: 1 });
  } else if (positions) {
    jobs = await Job.find({
      position: { $in: positions },
    }).sort({ date: 1 });
  } else if (cities) {
    jobs = await Job.find({
      city: { $in: cities },
    }).sort({ date: 1 });
  } else if (republics) {
    jobs = await Job.find({
      republic: { $in: republics },
    }).sort({ date: 1 });
  } else if (months) {
    jobs = await Job.find({
      month: { $in: months },
    }).sort({ date: 1 });
  } else {
    res.status(200).send({
      message: "No valid search parameters provided",
    });
  }
  try {
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
