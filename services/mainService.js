// import aatalklinik from "./aatalklinik.js";
// import krankenhausAugustin from "./krankenhausAugustin.js";
// import krakehan from "./krakenhaus.js";
// import dusseldorf from "./dusseldorf.js";
import johanniter from "./johanniter.js";

const mainService = async () => {
  return Promise.all([johanniter()]).then((results) => {
    return results.flat(1);
  });
};

export default mainService;
