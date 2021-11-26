import puppeteer from "puppeteer";

const recruiting = () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    let url = "https://recruitingapp-4181.de.umantis.com/Jobs/1?lang=ger";

    await page.goto(url, {
      waitUntil: "load",
      timeout: 0,
    });
    //wait for a while
    await page.waitForTimeout(1000);
  } catch (error) {
    console.log(error);
  }
};
