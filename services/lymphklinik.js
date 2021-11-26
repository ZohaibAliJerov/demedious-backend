import puppeteer from "puppeteer";

const lymphklinik = async () => {
  try {
    let browser = await puppeteer.launch({ headless });
    let page = await browser.newPage();
    let url = "https://www.lymphklinik.com/karriere.html";
  } catch (error) {
    console.log(error);
  }
};
