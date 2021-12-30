import aatalklinik from "./aatalklinik.js";
const mainService = async () => {
  return Promise.all([aatalklinik()]).then((results) => {
    return results.flat(1);
  });
};

export default mainService;
