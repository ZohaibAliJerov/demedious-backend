import johanniter from "./johanniter.js";
import aatalklinik from "./aatalklinik.js";
//import katherina from "./katharina.js";
import florence from "./florence.js";
import klinikSorpesee from "./klinikSorpesee.js";
const mainService = async () => {
  return Promise.all([
    johanniter(),
    aatalklinik(),
    florence(),
    klinikSorpesee(),
  ]).then((results) => {
    return results.flat(1);
  });
};

export default mainService;
