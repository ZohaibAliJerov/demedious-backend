import puppeteer from "puppeteer";

const paracelsus = async () => {
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();

  let url = "https://jobs.pkd.de/category/golzheim/5564";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //TODO:scroll the page
  //TODO:get all job links
  //TODO:get all job details
  await page.close();
  await browser.close();
};
