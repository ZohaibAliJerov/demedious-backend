import mongoose from "mongoose";

let month = new Date().getMonth();
switch (month) {
  case 0:
    month = "January";
    break;
  case 1:
    month = "February";
    break;
  case 2:
    month = "March";
    break;
  case 3:
    month = "April";
    break;
  case 4:
    month = "May";
    break;
  case 5:
    month = "June";
    break;
  case 6:
    month = "July";
    break;
  case 7:
    month = "August";
    break;
  case 8:
    month = "September";
    break;
  case 9:
    month = "October";
    break;
  case 10:
    month = "November";
    break;
  case 11:
    month = "December";
    break;
  default:
    month = "";
    break;
}

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
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
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Job", jobSchema);
