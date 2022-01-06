import puppeteer from "puppeteer";

const panklinik = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let url = "https://www.pan-klinik.de/stellenangebote/";
    await page.goto(url, { timestamp: 0, waitUntil: "load" });
    //TODO:scroll

    //TODO: get all jobs

    //TODO: geta ll jobs details
  } catch (err) {
    console.log(err);
  }
};
