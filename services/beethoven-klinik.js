import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = "https://www.beethoven-klinik-koeln.de/?s=jobs";
  await page.goto(url);

  // extracting job titles from page
  const jobTitles = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll("header.entry-header h1.entry-title")
    ).map((title) => title.innerText)
  );
  console.log(jobTitles);

  // extracting job links from first page

  const jobLinks = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll("header.entry-header h1.entry-title a")
    ).map((link) => link.href)
  );
  console.log(jobLinks);

  await browser.close();
})();
