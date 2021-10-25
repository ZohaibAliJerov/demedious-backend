/**
 * first service
 */
import puppeteer from "puppeteer";

const florenceService = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url =
    "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%3Fref%3Dausbildungsatlas";
  await page.goto(url, { timeout: 0 });
  await page.waitForNavigation();
  await page.waitForTimeout(3000);

  //scroll the page
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Space");
  }
};

export default florenceService;
