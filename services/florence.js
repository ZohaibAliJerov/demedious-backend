/**
 * first service
 */
import puppeteer from "puppeteer";

const florenceService = async () => {
  let allPages = [];
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%3Fref%3Dausbildungsatlas",
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%2527a%3D0chash%3D3b4262abd33953cbcab28989398ca953&tx_ttnews%5Bpointer%5D=1&cHash=5acac32e6cd26b46843fc7ce24f87062",
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%25252525252527A%2525253D0&tx_ttnews%5Bpointer%5D=2&cHash=e9db8017b61c163e555efe7db57bdcc4",
    ];
    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
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
      //get all job links

      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.news-list-item.clearfix > h2 > a")
        ).map((el) => el.href);
      });
      allJobs.push(jobs);
      counter++;
    } while (counter < allLinks.length);
    console.log(allJobs);
  } catch (err) {
    console.log(err);
  }
  console.log(allPages);
};

export default florenceService;
