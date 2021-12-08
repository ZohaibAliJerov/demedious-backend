import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  location: {
    type: String,
  },
  email: {
    type: String,
  },
  cell: {
    type: String,
  },
  applyLink: {
    type: String,
  },
});

export default mongoose.model("Job", jobSchema);
