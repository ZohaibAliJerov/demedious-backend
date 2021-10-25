/**
 * first service
 */
import puppeteer from "puppeteer";

const florenceService = async () => {
  const browser = await puppeteer.launch({ headles: false });
  const page = await browser.newPage();
  const url =
    "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%3Fref%3Dausbildungsatlas";
  await page.goto(url, { timeout: 0 });
  await page.waitForNavigation();
  await page.waitForTimeout(3000);

  //scroll the page
  await autoScroll(page);
};

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

export default florenceService;
