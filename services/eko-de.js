import puppeteer from "puppeteer";

(async function () {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    let allJobs = [];
    let allLinks = ["https://eko.de/unternehmen/stellenangebote.html"];
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
        return Array.from(
          document.querySelectorAll(".listitem > .listitemtitle a")
        ).map((el) => el.href);
      });
      allJobs.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    // console.log(allJobs);

    // getting all the data from links
    let allJobDetails = [];
    for (const url of allJobs) {
      await page.goto(url);
      scroll(page);
      await page.waitForSelector("div.jobmodul");

      //get job titles
      let jobTitles = await page.evaluate(() => {
        let text = document.querySelector("div.jobmodul h1");
        return text ? text.innerText : null;
      });

      // console.log(jobTitles);

      // get phone numbers
      let contactNumbers = await page.evaluate(() => {
        let numberRegex =
          /\d{4} \d{3}-\d{4}| \d{4}[/]\d{3} \d{4}|\d{4} \d{3} \d{4} |\d{4}-\d{3}-\d{4} | \d{4}[/] \d{3} \d{4} |\d{4} \d{3} \d{4} |\d{4}-\d{3}-\d{4} |\d{4} \d{3} \d{4}/;
        let num = Array.from(document.querySelectorAll("#c33179 > div > div"));
        num = num.map((el) => el.innerText);
        let numbr = num.join(" ");
        numbr = numbr.match(numberRegex);
        return numbr;
      });
      // console.log(contactNumbers);

      // get all job apply emails
      let applyJobEmails = await page.evaluate(() => {
        return document.querySelector(".jobmodul a").href;
      });
      // console.log(applyJobEmails);

      //get emails
      let emailLink = await page.evaluate(() => {
        return document.querySelector(".csc-textpic-text a").href;
      });

      //Job details
      let jobDetails = {
        jobTitles,
        contactNumbers,
        applyJobEmails,
        emailLink,
      };

      // push job details
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
