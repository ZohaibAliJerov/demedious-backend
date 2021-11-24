import puppeteer from "puppeteer";

const johanniter = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let url =
      "https://www.johanniter.de/johanniter-kliniken/neurologisches-rehabilitationszentrum-godeshoehe/karriere/";

    //scroll the page
    for (let i = 0; i < 100; i++) {
      if (
        document.scrollingElement.scrollTop + window.innerHeight >=
        document.scrollingElement.scrollHeight
      ) {
        break;
      }
      await page.evaluate(() => {
        document.scrollingElement.scrollBy(0, 100);
      });
      await page.waitForTimeout(1000);
    }
    //get all pages
    let pages = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".c-pagination__list > li > a")
      );
    });

    //get all jobs
    for (let pg of pages) {
      //visit each page
      await page.goto(pg, { waitUntil: "load", timeout: 0 });
    }
    await page.goto(url);
  } catch (error) {
    console.log(error);
  }
};
