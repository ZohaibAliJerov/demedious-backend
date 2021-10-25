/**
 * first service
 */
import puppeteer from "puppeteer";

const florenceService = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    const url =
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%3Fref%3Dausbildungsatlas";
    await page.goto(url, { timeout: 0 });

    //scroll the page
    await page.evaluate(() => {
      const distance = 100;
      const delay = 100;
      const timer = setInterval(() => {
        document.scrollingElement.scrollBy(0, distance);
        if (
          document.scrollingElement.scrollTop + window.innerHeight >=
          document.scrollingElement.scrollHeight
        ) {
          clearInterval(timer);
        }
      }, delay);
    });
  } catch (err) {
    console.log(err);
  }
};

export default florenceService;
