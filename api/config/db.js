import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  mongoose.connect(
    "mongodb+srv://admin:1990xe98@cluster0.b86j3.mongodb.net/hospital?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (!err) {
        console.log("connected to MongoDB Database");
      } else {
        console.log("Database connection error");
      }
    }
  );
};

export default connect;
