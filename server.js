import express from "express";
import { config } from "dotenv";
import mainService from "./services/mainService.js";
import { CronJob } from "cron";
import userRoutes from "./api/routes/user.routes.js";
import jobRoutes from "./api/routes/job.routes.js";
import resetRoutes from "./api/routes/resetPassword.routes.js";
import connect from "./api/config/db.js";
import Job from "./api/models/Job.model.js";
import cors from "cors";

//env config
config();

//app config
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//port config
const port = process.env.PORT || 3000;

//db config for APIs
connect();

async function run() {
  try {
    let allJobs = await mainService();
    Job.updateMany(allJobs, { upsert: true })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  } finally {
    console.log("Job ran successfully!");
  }
}

//routes config
//home
app.get("/", (req, res) => {
  res.status(200).send({ message: "welcome to home" });
});
//user routes
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use("/api/v1/users", userRoutes);
//job routes
app.use("/api/v1/jobs", jobRoutes);
//reset password routes
app.use("/api/v1/resetpassword", resetRoutes);

// const job = new CronJob(
//   " 0 30 * * * *",
//   () => {
//     run().catch(console.dir);
//   },
//   null,
//   true,
//   "Europe/Berlin"
// );

// job.start();
run();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
