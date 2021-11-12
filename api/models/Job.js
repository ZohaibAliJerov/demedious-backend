import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cell: {
    type: String,
    required: true,
  },
  applyLink: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Job", jobSchema);
