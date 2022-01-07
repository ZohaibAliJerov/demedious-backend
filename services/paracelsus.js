import puppeteer from "puppeteer";

const paracelsus = async () => {
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();

  let url = "https://jobs.pkd.de/category/golzheim/5559";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //TODO:scroll the page
  await scroll(page);
  //TODO:get all job links
  let links = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".module.moduleItems.hasShonts > a ")
    ).map((el) => el.href);
  });
  //TODO:get all job details
  await page.close();
  await browser.close();
};

async function scroll(page) {
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
}
