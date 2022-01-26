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
  email: {
    type: String,
  },
  republic: {
    type: String,
  },
  month: {
    type: Number,
    default: new Date().getMonth(),
  },
  date: {
    type: Date,
    default: new Date().toLocaleDateString(),
  },
});

export default mongoose.model("Job", jobSchema);
