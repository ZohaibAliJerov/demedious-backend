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
    let pages = [];
    let counter = 0;
    do {
      if (counter > 0) {
        await page.click(pages[counter]);
      }
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
      let allJobs = [];
      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.news-list-item.clearfix > h2 > a")
        ).map((el) => el.href);
      });
      allJobs.push(jobs);
      console.log(allJobs);
      if (counter == 0) {
        pages.push(
          Array.from(
            document.querySelectorAll("div.browseLinksWrap > span > font")
          )
        );
      }
      counter++;
    } while (pages < 3);
  } catch (err) {
    console.log(err);
  }
};

export default florenceService;
