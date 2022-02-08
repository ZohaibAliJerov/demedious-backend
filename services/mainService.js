// import aatalklinik from "./aatalklinik.js";
// import krankenhausAugustin from "./krankenhausAugustin.js";
// import krakehan from "./krakenhaus.js";
// import dusseldorf from "./dusseldorf.js";
//import johanniter from "./johanniter.js";
// import haan from "./haan.js";
// import gut from "./gut.js";
// import gutersloh from "./gutersloh.js";
// import hoxter from "./hoxter.js";
// import langenfeld from "./langenfeld.js";
// import koln1 from "./koln1.js";
// import herten from "./herten.js";
// import hilden from "./hilden.js";
// import duren from "./duren.js";
// import dortmund1 from "./dortmund1.js";
// import dortmund2 from "./dortmund2.js";
// import dortmund3 from "./dortmund3.js";
//import koln from "./koln.js";
// import heinsbergg from "./heinsbergg/heinsbergg.js";
// import koln1 from "./koln1/koln1.js";
// import badberleburgg from "./badberleburrg.js";
// import hattingenn from "./hattingenn/hattingenn.js";
// import wuppertalOne from "./wuppertalOne/wuppertalOne.js";
// import bonnOne from "./bonnOne/bonnOne.js";
// import teildesganzen from "./teildesganzen/teildesganzen.js";
// import herford from "./herford/herford.js";
// import maerkische from "./maerkische/maerkische.js";
// import mathias from "./mathias/mathias.js";
// import maerkische from "./maerkische/maerkische.js";
// import diakonie from "./diakonie/diakonie.js";
// import serverinskloesterchen from "./severinskloesterchen/severinskloesterchen.js";
// import kreisklinikumSiegen from "./kreisklinikumSiegen/kreisklinikumSiegen.js";
// import kaiser from "./kaiser/kaiser.js";
// import johanniterTwo from "./johanniterTwo/johanniterTwo.js";
// import johanniterOne from './johanniterOne/johanniterOne.js'
// import hochsauerland from './hochsauerland/hochsauerland.js'
// import johnniterThree from "./jonniterThree/jonniterThree.js";
// import lukass from "./lukass/lukass.js";
// import gmbh from "./gmbh/gmbh.js";
// import balthasar from "./balthasar/balthasar.js";
// import hellweg from "./hellweg/hellweg.js";
// import westfalenn from "./westfalenn/westfalenn.js";
// import klinikring from "./klinikring/klinikring.js";
// import christophorus from "./christophorus/christophorus.js";
// import klinikumbochum from "./klinikumbochum/klinikumbochum.js";
import eichholz from "./eichholz/eichholz.js";
// import reha from "./reha/reha.js";
const mainService = async () => {
  return Promise.all([
    // koln1(),
    // haan(),
    // gut(),
    // gutersloh(),
    // hoxter(),
    // langenfeld(),
    // herten(),
    // hilden(),
    // duren(),
    // dortmund1(),
    // dortmund2(),
    // dortmund3(),
    // heinsbergg()
    // koln1()
    // badberleburgg()
    // hattingenn()
    // wuppertalOne()
    // bonnOne()
    // teildesganzen()
    // herford()
    // mathias()
    // maerkische()
    // diakonie()
    // serverinskloesterchen()
    // kreisklinikumSiegen()
    // johanniterOne()
    // johanniterTwo()
    // kaiser()
    // hochsauerland()
    // lukass()
    // johnniterThree()
    // gmbh()
    // balthasar()
    // hellweg()
    // westfalenn()
    // klinikring()
    // christophorus()
    // klinikumbochum()
    // reha()
    eichholz()
  ]).then((results) => {
    return results.flat(1);
  });
};

export default mainService;
