import aatalklinik from "./aatalklinik.js";
import johaniter from "./johanniter.js";
import krakehan from "./krakenhaus.js";
const mainService = async () => {
  return Promise.all([aatalklinik(), krakehan(), johaniter()]).then(
    (results) => {
      return results.flat(1);
    }
  );
};

export default mainService;
