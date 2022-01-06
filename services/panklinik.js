import puppeteer from "puppeteer";

const panklinik = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let url = "https://www.pan-klinik.de/stellenangebote/";
    await page.goto(url, { timestamp: 0, waitUntil: "load" });
  } catch (err) {
    console.log(err);
  }
};
