import express from "express";
import { config } from "dotenv";
import florenceService from "./services/florence.js";
//env config
config();

//app config
const app = express();

//port config
const port = process.env.PORT || 3000;

//services
(async () => {
  await florenceService();
})();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
