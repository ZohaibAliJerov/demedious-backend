import puppeteer from "puppeteer";

const octapharmaplasma = async () => {
  try {
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();
    let url = "https://www.octapharmaplasma.de/jobs";
    let locations = [];
    //visit the site
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    await page.waitForTimeout(3000);
    //remove the dialogue box
    await page.waitForSelector("div.ccm__cheading__close");
    await page.click("div.ccm__cheading__close");
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
    });
    //get all locations
    locations = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".card-header > h3")).map(
        (el) => el.innerText
      );
    });
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.card-body > p > a"))
        .map((el) => el.href)
        .filter((el) => !el.includes("@"));
    });
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      await page.goto(jobLink, { waitUntil: "load", timeout: 0 });
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
      });

      //get title
      let title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });

      let location = await page.evaluate(() => {
        return document.body.innerText
          .split(",")
          .map((el) => el.split(" "))
          .flat(1);
      });
      for (let lctn of locations) {
        if (location.includes(lctn)) {
          location = lctn;
          break;
        }
      }
      let cell = await page.evaluate(() => {
        return "";
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
export default octapharmaplasma;
