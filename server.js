import express from "express";
import { config } from "dotenv";

//env config
config();

//app config
const app = express();

//port config
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
