import johanniter from "./johanniter.js";
import katherina from "./katharina.js";
import klinikSorpesee from "./klinikSorpesee";
import recruiting from "./recruiting.js";

const mainService = async () => {
  let jobCollection1 = await katherina();
  let jobCollection2 = await johanniter();
  let jobCollection3 = await klinikSorpesee();
  let jobCollection4 = await recruiting();
};
