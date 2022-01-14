import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },
  location: {
    type: String,
  },
  hospital: {
    type: String,
  },
  link: {
    type: String,
  },
  level: {
    type: String,
  },
  position: {
    type: String,
  },
  city: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Job", jobSchema);
