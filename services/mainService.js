import aatalklinik from "./aatalklinik.js";
import krankenhausAugustin from "./krankenhausAugustin.js";
import krakehan from "./krakenhaus.js";

const mainService = async () => {
  return Promise.all([aatalklinik(), krakehan(), krankenhausAugustin()]).then(
    (results) => {
      return results.flat(1);
    }
  );
};

export default mainService;
