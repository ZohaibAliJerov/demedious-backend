import puppeteer from "puppeteer";

(async function () {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    let allJobs = [];
    let allLinks = [
      "https://www.klinikum-lev.de/stellenangebote.aspx?jobag=KL&jobagg=%C3%84rztlicher%20Dienst%20(Medizin)",
    ];
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
        return Array.from(document.querySelectorAll(".striped a")).map(
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
      await page.waitForSelector(
        "body > center > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td h1"
      );

      //get job titles
      const jobTitles = await page.evaluate(() => {
        return (
          document.querySelector(
            "body > center > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td h1"
          ).innerText || null
        );
      });
      // console.log(jobTitles);

      //get location
      const location = await page.evaluate(() => {
        let regex =
          /[a-zA-Z]+. [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+[\n][a-zA-Z]+.\s\d+[\n]\d+\s[a-zA-Z]+/;
        let text = document.querySelector("body");
        return text ? text.innerText.match(regex) : null;
      });
      // console.log(location);

      //get phone numbers
      const cell = await page.evaluate(() => {
        let phoneRegex = /\d+ \d+.\d+/;
        let phone = document.querySelector("body");
        return phone ? phone.innerText.match(phoneRegex) : null;
      });
      // console.log(phone);

      // get all the contact no.
      let jobDetails = {
        jobTitles,
        location,
        cell,
      };
      allJobDetails.push(jobDetails);
    }
    await page.waitForTimeout(3000);
    console.log(allJobDetails);
    await browser.close();
    return allJobDetails;
  } catch (error) {
    console.log(error);
  }
})();
