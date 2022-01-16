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
  let { title, levels, positions, locations, cities, months } = req.body;
  //levels,positions,locations are arrays
  let jobs = [];
  if (title && levels && positions && locations && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (title && levels && positions && locations && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
      city: { $in: cities },
    });
  } else if (title && levels && positions && locations && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
      month: { $in: months },
    });
  } else if (title && levels && positions && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (title && levels && locations && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      levels: { $in: levels },
      location: { $in: locations },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (title && levels && positions && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      cities: { $in: cities },
      month: { $in: months },
    });
  } else if (title && positions && locations && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      location: { $in: locations },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (levels && positions && locations && cities && months) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (title && levels && positions && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      loction: { $in: locations },
    });
  } else if (title && levels && positions && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
    });
  } else if (title && levels && locations && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      location: { $in: locations },
      city: { $in: cities },
    });
  } else if (title && levels && positions && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
      month: { $in: months },
    });
  } else if (title && levels && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (title && positions && locations && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      location: { $in: locations },
      month: { $in: months },
    });
  } else if (title && positions && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (title && locations && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      location: { $in: locations },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (title && levels && positions) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      position: { $in: positions },
    });
  } else if (title && levels && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      city: { $in: cities },
    });
  } else if (title && levels && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      location: { $in: locations },
    });
  } else if (title && levels && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      level: { $in: levels },
      month: { $in: months },
    });
  } else if (title && positions && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      city: { $in: cities },
    });
  } else if (title && positions && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      location: { $in: locations },
    });
  } else if (title && positions && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
      month: { $in: months },
    });
  } else if (title && cities && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
      location: { $in: locations },
    });
  } else if (title && cities && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (title && locations && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      location: { $in: locations },
      month: { $in: months },
    });
  } else if (levels && positions && cities) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      city: { $in: cities },
    });
  } else if (levels && positions && locations) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      location: { $in: locations },
    });
  } else if (levels && positions && months) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
      month: { $in: months },
    });
  } else if (levels && cities && locations) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
      location: { $in: locations },
    });
  } else if (levels && cities && months) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (levels && locations && months) {
    jobs = await Job.find({
      level: { $in: levels },
      location: { $in: locations },
      month: { $in: months },
    });
  } else if (positions && cities && months) {
    jobs = await Job.find({
      position: { $in: positions },
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (positions && locations && months) {
    jobs = await Job.find({
      position: { $in: positions },
      location: { $in: locations },
      month: { $in: months },
    });
  } else if (cities && locations && months) {
    jobs = await Job.find({
      city: { $in: cities },
      location: { $in: locations },
      month: { $in: months },
    });
  } else if (title && levels) {
      jobs = await Job.find({
        title: { $regex: title, $options: "i" },
        level: { $in: levels }
    });

  } else if (title && positions) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      position: { $in: positions },
    });
  } else if (title && cities) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      city: { $in: cities },
    });
  } else if (title && locations) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      location: { $in: locations },
    });
  } else if (title && months) {
    jobs = await Job.find({
      title: { $regex: title, $options: "i" },
      month: { $in: months },
    });
  } else if (levels && positions) {
    jobs = await Job.find({
      level: { $in: levels },
      position: { $in: positions },
    });
  } else if (levels && cities) {
    jobs = await Job.find({
      level: { $in: levels },
      city: { $in: cities },
    });
  } else if (levels && locations) {
    jobs = await Job.find({
      level: { $in: levels },
      location: { $in: locations },
    });
  } else if (levels && months) {
    jobs = await Job.find({
      level: { $in: levels },
      month: { $in: months },
    });
  } else if (positions && cities) {
    jobs = await Job.find({
      position: { $in: positions },
      city: { $in: cities },
    });
  } else if (positions && locations) {
    jobs = await Job.find({
      position: { $in: positions },
      location: { $in: locations },
    });
  } else if (positions && months) {
    jobs = await Job.find({
      position: { $in: positions },
      month: { $in: months },
    });
  } else if (cities && locations) {
    jobs = await Job.find({
      city: { $in: cities },
      location: { $in: locations },
    });
  } else if (cities && months) {
    jobs = await Job.find({
      city: { $in: cities },
      month: { $in: months },
    });
  } else if (locations && months) {
    jobs = await Job.find({
      location: { $in: locations },
      month: { $in: months },
    });
  } else if (locations && cities) {
    jobs = await Job.find({
      location: { $in: locations },
      city: { $in: cities },
    });
  } else if (title) {
    jobs = await Job.find({
      
      title: { $regex: title, $options: "i" }
    });
  } else if (levels) {
    jobs = await Job.find({
      level: { $in: levels },
    });
  } else if (positions) {
    jobs = await Job.find({
      position: { $in: positions },
    });
  } else if (cities) {
    jobs = await Job.find({
      city: { $in: cities },
    });
  } else if (locations) {
    jobs = await Job.find({
      location: { $in: locations },
    });
  } else if (months) {
    jobs = await Job.find({
      month: { $in: months },
    });
  } else {
    res.status(200).send({
     message: "No valid search parameters provided" 
    })
  }
    
  try {
    res.status(200).send(jobs);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
