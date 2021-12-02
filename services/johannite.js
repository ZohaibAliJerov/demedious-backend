import puppeteer from "puppeteer";

const johanneiter = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/",
      "https://www.johanniter.de/jo hanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=2&cHash=7ea1ac21af90d15dc61fea4a1e1fcc7b",
      "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=3&cHash=29fa0d4566af249941be02c6837d67f1",
      "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=4&cHash=f4952cb1f467cf5ff54d3dba6509eac5",
      "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=5&cHash=f2c3f31c88e41918566b7e8251f53c3b",
    ];

    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      //  get all job links
      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".c-content-list__text > h3 > a")
        ).map((el) => el.href);
      });
      console.log(jobs);
      allJobs.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    console.log(allJobs.length);
    let allJobDetails = [];
    // get data from every job post
    for (const url of allJobs) {
      await page.goto(url);
      scroll(page);

      await page.waitForSelector("h1");
      const title = await page.evaluate(() => {
        return document.querySelector("h1").innerText || null;
      });

      //   get contacts
      await page.waitForSelector("a.c-link.u-icon.u-icon.u-icon--phone");
      let cell = await page.evaluate(() => {
        let num = document.querySelector(
          "a.c-link.u-icon.u-icon.u-icon--phone"
        );
        return num ? num.href : null;
      });
      // get email
      await page.waitForSelector("div.o-grid__row");
      let email = await page.evaluate(() => {
        let text = document.querySelector("div.o-grid__row");
        return text
          ? text.innerText.match(
              /[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+-[a-zA-Z0-9]+.[a-zA-Z0-9]+/g
            )
          : null;
      });

      // get address
      let location = await page.evaluate(() => {
        let text = document.querySelector(".o-grid__row");

        return text
          ? text.innerText.match(
              /[a-zA-Z0-9]+ [a-zA-Z0-9]+[\n\][a-zA-Z0-9]+ [a-zA-Z0-9]+ \d+[\n][\n]\d+ [a-zA-Z0-9]+/
            )
          : null;
      });
      let applyLink = await page.evaluate(() => {
        let text = document.querySelector(
          "a.c-button.c-button--main.c-button--large"
        );
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
      await page.waitForTimeout(3000);
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

export default johanneiter;
