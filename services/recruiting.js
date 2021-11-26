import puppeteer, { TimeoutError } from "puppeteer";

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
  } catch (error) {
    console.log(error);
  }
};
