import puppeteer from "puppeteer";

const octapharmaplasma = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let url = "https://www.octapharmaplasma.de/jobs";

    //visit the site
    await page.goto(url, { waitUntil: "load", timeout: 0 });

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
        setTimeout(1000);
      }

      //get all locations
      let allLocations = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".card-header > h3")).map(
          (el) => el.innerText
        );
      });

      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        let links = document.querySelectorAll("div.card-body > p > a");
        return links ? links.map((el) => el.href) : "";
      });

      for (let jobLink of jobLinks) {
        await page.goto(jobLink, { timeout: 0, waitUntil: "load" });
          await page.waitForTimeout(1000);
          
          
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
        setTimeout(1000);
      }
          
      }
    });
  } catch (error) {
    console.log(error);
  }
};
