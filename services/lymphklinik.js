import puppeteer from "puppeteer";

const lymphklinik = async () => {
  try {
    let browser = await puppeteer.launch({ headless });
    let page = await browser.newPage();
  } catch (error) {
    console.log(error);
  }
};
