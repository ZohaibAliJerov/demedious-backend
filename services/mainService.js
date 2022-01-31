// import aatalklinik from "./aatalklinik.js";
// import krankenhausAugustin from "./krankenhausAugustin.js";
// import krakehan from "./krakenhaus.js";
// import dusseldorf from "./dusseldorf.js";
//import johanniter from "./johanniter.js";

import haan from "./haan.js";
import gut from "./gut.js";
import gutersloh from "./gutersloh.js";
import hoxter from "./hoxter.js";
import langenfeld from "./langenfeld.js";
import koln1 from "./koln1.js";
import herten from "./herten.js";
import hilden from "./hilden.js";
import duren from "./duren.js";
import dortmund1 from "./dortmund1.js";
import dortmund2 from "./dortmund2.js";
import dortmund3 from "./dortmund3.js";

//import koln from "./koln.js";

const mainService = async () => {
  return Promise.all([
    koln1(),
    haan(),
    gut(),
    gutersloh(),
    hoxter(),
    langenfeld(),
    herten(),
    hilden(),
    duren(),
    dortmund1(),
    dortmund2(),
    dortmund3(),
  ]).then((results) => {
    return results.flat(1);
  });
};

export default mainService;
