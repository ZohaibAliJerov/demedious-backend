import puppeteer, { PageEmittedEvents, TimeoutError } from "puppeteer";

const recruiting = () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    let url = "https://recruitingapp-4181.de.umantis.com/Jobs/1?lang=ger";

    await page.goto(url, {
      waitUntil: "load",
      timeout: 0,
    });
    //wait for a while
    await page.waitForTimeout(1000);

    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
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
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".HSTableLinkSubTitle")
        ).map((el) => el.href);
      });
      allJobLinks.push(...jobLinks);
      await page.waitForTimeout(3000);
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector("a#tablenav_bottom_nextlink_66856");
      });
      if (bottomNextLink) {
        await page.click("a#tablenav_bottom_nextlink_66856");
        nextPage = true;
      } else {
        nextPage = false;
      }
    } //end of while loop

    //visit each job link
    for (let jobLink of allJobLinks) {
      await page.goto(jobLink, { timeout: 0, waitUntil: "load" });

      await waitForTimeout(1000);

      //TODO:get title
      let title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      //TODO:get location
      let location = await page.evaluate(() => {
        return document.querySelector(".inserat-short-info > font").innerText;
      });
      //TODO:get email
      let email = await page.evaluate(() => {
        return "";
      });
      //TODO:get cell
      let cell = await page.evaluate(() => {
        return document.querySelector();
      });
      //TODO:get applyLink
      let applyLink = await page.evaluate(() => {
        return document.querySelector();
      });
    }
  } catch (error) {
    console.log(error);
  }
};
