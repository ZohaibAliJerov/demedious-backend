import puppeteer from "puppeteer";

(async function () {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    let allJobs = [];
    let allLinks = ["https://www.beethoven-klinik-koeln.de/karriere/"];
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
    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);

      // get all jobs links
      let jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("h2.entry-title a")).map(
          (el) => el.href
        );
      });
      allJobs.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    console.log(allJobs);

    // getting all the data from links
    let allJobDetails = [];
    for (const url of allJobs) {
      await page.goto(url);
      scroll(page);
      await page.waitForSelector(".entry-title");

      let jobTitles = await page.evaluate(() => {
        let jobTitle = document.querySelector(".entry-title");
        return jobTitle ? jobTitle.innerText : null;
      });

      // console.log(jobTitles)
      let postedDate = await page.evaluate(() => {
        return document.querySelector("div.entry-meta").innerText;
      });
      // console.log(postedDate);

      // get all job apply emails
      let jobApplyEmail = await page.evaluate(() => {
        let regex = /[\w-]+@([\w-]+\.)+[\w-]+/;
        let text = Array.from(document.querySelectorAll("div.entry-content a"));
        text = text.map((el) => el.href);
        let str = text.join(" ");
        str = str.match(regex);
        return str;
      });

      //Job details
      let jobDetails = {
        jobTitles,
        postedDate,
        jobApplyEmail,
      
      };

      //push job details
      allJobDetails.push(jobDetails);
      console.log(jobDetails);
    }
    await page.waitForTimeout(3000);
    // console.log(allJobDetails);
    await browser.close();
    // return allJobDetails
  } catch (error) {
    console.log(error);
  }
})();
