import puppeteer from "puppeteer";

const recruiting = () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    let url = "https://recruitingapp-4181.de.umantis.com/Jobs/1?lang=ger";
  } catch (error) {
    console.log(error);
  }
};
