import puppeteer from "puppeteer";

const nrkAarchecn = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  let url = "http://nrk-aachen.de/nrk-aachen-jobs/";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  let jobs = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        "div.column.dt-sc-full-width.first > ul > li > a"
      )
    ).map((el) => el.innerText);
  });
};
