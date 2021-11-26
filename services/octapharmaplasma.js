import puppeteer from "puppeteer";

const octapharmaplasma = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let url = "https://www.octapharmaplasma.de/jobs";

    //visit the site
    await page.goto(url, { waitUntil: "load", timeout: 0 });
  } catch (error) {
    console.log(error);
  }
};
