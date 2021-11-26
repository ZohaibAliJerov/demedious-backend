import puppeteer from "puppeteer";

const lymphklinik = async () => {
  try {
    let browser = await puppeteer.launch({ headless });
    let page = await browser.newPage();
    let url = "https://www.lymphklinik.com/karriere.html";
    await page.goto(url, { timeout: 0, waitUntil: "load" });

    //scroll the page
    await page.evaluate(() => {
      for (let i = 0; i < 100; i++) {
        if (
          document.scrollingElement.scrollTop + window.innerHeight >=
          document.scrollingElement.scrollHeight
        ) {
          break;
        }
        document.scrollingElement.scrollBy(0, 100);
      }
    });

    //get all jobs
    let jobs = await page.evaluate(() => {
      return Array.from(document.querySelctor("tm-article > ul > li"));
    });
  } catch (error) {
    console.log(error);
  }
};
