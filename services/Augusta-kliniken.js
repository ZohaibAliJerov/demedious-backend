import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto(
    "https://www.augusta-kliniken.de/bildung-karriere/stellenangebote.html"
  );

  const Titles = await page.evaluate(() => {
    return {
      Title: Array.from(document.querySelectorAll("div.text")).map(
        (titl) => titl.innerText
      ),
    };
  });

  const links = await page.evaluate(() => {
    return {
      Title: Array.from(document.querySelectorAll("div.text a")).map(
        (link) => link.href
      ),
    };
  });

  let phoneNumbers = [];

  for (let i = 0; i <= [links].length; i++) {
    await page.evaluate(() => {
      document.querySelector("#article-943 > div > p:nth-child(16)");
    });
    phoneNumbers.push(i);
    console.log(phoneNumbers.length);
  }

  // console.log(Titles);
  // console.log(links);
  await browser.close();
})();
