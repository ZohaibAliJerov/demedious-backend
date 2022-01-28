// import aatalklinik from "./aatalklinik.js";
// import krankenhausAugustin from "./krankenhausAugustin.js";
// import krakehan from "./krakenhaus.js";
// import dusseldorf from "./dusseldorf.js";
//import johanniter from "./johanniter.js";
import koln from "./koln.js";
import krankenhus from"./Krankenhus-enger.js";
import dionyius from"./dionyius.js";
const mainService = async () => {
  return Promise.all([krankenhus(),dionyius()]).then((results) => {
    return results.flat(1);
  });
};

export default mainService;
