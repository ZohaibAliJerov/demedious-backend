import puppeteer from "puppeteer";
const schwelm = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.helios-gesundheit.de/kliniken/schwelm/unser-haus/karriere/stellenangebote/",
    ];
    let counter = 0;
    do {
      await page.goto(allLinks[counter], {
        timeout: 0,
      });
      scroll(page);
      //  get all job links
      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".tabular-list__item > a")
        ).map((el) => el.href);
      });
      console.log(jobs);
      allJobs.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    let allJobDetails = [];
    // get data from every job post
    for (const url of allJobs) {
      await page.goto(url);
      scroll(page);

      await page.waitForSelector(".billboard-panel__body > h2");
      const title = await page.evaluate(() => {
        let text = document.querySelector(".billboard-panel__body > h2");
        return text ? text.innerText : null;
      });

      //get contacts
      await page.waitForSelector(".content-block-list");
      let cell = await page.evaluate(() => {
        let text = document.getElementsByClassName(
          "content-block-list__item"
        )[4];
        return text
          ? text.innerText.match(
              /(\+\d{2}).\d{4}.\d{2}\-\d{4}/g
            )
          : null;
      });
      //     // get email
      let email = await page.evaluate(() => {
        let text = document
          .querySelector(".content-block-list__container")
          .getElementsByTagName("article")[4];
        return text
          ? text.innerText.match(
              /[a-zA-Z]+.[a-zA-Z]+.(\[at\]).[a-zA-Z-]+.[a-zA-Z]+|[a-zA-Z-]+.[a-zA-Z]+.[a-zA-Z]+.(\[at\]).[a-zA-Z-]+[a-zA-Z]+.[a-zA-Z]+/g
            )
          : null;
      });

      // get location
      await page.waitForSelector(".content-block-list");
      let location = await page.evaluate(() => {
        let text = document
          .querySelector(".content-block-list")
          .getElementsByTagName("article")[4];
        return text
          ? text.innerText.match(
              /[A-Za-z]+.[A-Za-z]+.[A-Za-z,]+..[A-Za-z.-]+.[A-Za-z-]+.[A-Za-z.]+.\d{2}\,.\d+.[A-Za-z]+.|[A-Za-z.]+[A-Za-z-]+.[A-Za-z-.]+.\d{2}\,.\d+.[A-Za-z]+./g
            )
          : null;
      });

      //get apply link
      await page.waitForSelector(".dialog__content");
      let applyLink = await page.evaluate(() => {
        let text = document.querySelector(".dialog__content >a");
        return text ? text.href : null;
      });
      const jobDetails = {
        title,
        cell,
        email,
        location,
        applyLink,
      };
      allJobDetails.push(jobDetails);
      await page.waitForTimeout(4000);
    }
    console.log(allJobDetails);
    await page.close();
    return allJobDetails;
  } catch (err) {
    console.log(err);
  }
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
schwelm();
export default schwelm;
