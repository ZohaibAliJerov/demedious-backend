import puppeteer from "puppeteer";

const johanniter = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let url =
      "https://www.johanniter.de/johanniter-kliniken/neurologisches-rehabilitationszentrum-godeshoehe/karriere/";

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

          setTimeout(1000);
      }
    });
    //get all pages
    let pages = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".c-pagination__list > li > a")
      );
    });

    //get all job links
    let allJobLinks = [];
    for (let pg of pages) {
      //visit each page
      await page.goto(pg, { waitUntil: "load", timeout: 0 });
      //scroll the each page
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
      });

      await page.evaluate(() => {
        allJobLinks.push(
          Array.from(
            document.querySelectorAll("div.c-content-list__text > h3 > a")
          )
        );
      });
    }

    // get all job details
    let allJobs = [];
    //visit all job links
    for (let link of allJobLinks) {
      await page.goto(link, { waitUntil: "load", timeout: 0 });
      await page.waitForTimeout(3000);
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
      });
      let title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });

      let location = await page.evaluate(() => {
        return document.querySelector(".c-inline-list__list  > li");
      });

      let cell = await page.evaluate(() => {
        return document.body.innerText.match(/\d+\s\d+-\d+/);
      });
      let email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });

      let applyLink = email;

      allJobs.push({ title, location, cell, email, applyLink });
    }
    return allJobs;
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  let data = await johanniter();
  console.log(data);
})();
