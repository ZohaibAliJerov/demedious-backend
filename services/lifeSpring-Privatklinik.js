import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
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
  };
let LIFESPRING_Privatklinik = async () => {
  try {
    let browser = await puppeteer.launch({
      headless:false,
    });
    let page = await browser.newPage();
    await page.goto("https://www.lifespring.de/karriere/", {
      waitUntil: "load",
      timeout: 0,
    });
 page.setDefaultNavigationTimeout(0)
    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("h3.joblist-item > a")
      ).map((el) => el.href);
    });
  await page.waitForTimeout(1000)
    console.log(jobLinks)

    await browser.close()
    await page.close()
} catch (err) {
    console.error(err);
  }
};


LIFESPRING_Privatklinik()