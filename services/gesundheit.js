import puppeteer from "puppeteer";
const gesundheit = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.helios-gesundheit.de/kliniken/lengerich/unser-haus/karriere/stellenangebote/",
      "https://www.helios-gesundheit.de/kliniken/lengerich/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=2&cHash=e3cff9e348ebb480dd7f42f9f7457ccf",
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

      await page.waitForSelector(".billboard-panel__title");
      const title = await page.evaluate(() => {
        let text = document.querySelector(".billboard-panel__title");
        return text ? text.innerText : null;
      });

      //get contacts
      await page.waitForSelector(".content-block-list");
      let cell = await page.evaluate(() => {
        let num = document.querySelector(".content-block-list");
        return num ? num.innerText.match(/[+\d]+\s[\d]+\s[\d-]+/) : null;
      });
      //     // get email
      await page.waitForSelector(".content-block-list");
      let email = await page.evaluate(() => {
        let text = document.querySelector(".content-block-list");
        return text ? text.innerText.match(/[a-z.]+\[at]+[a-z-.]+/g) : null;
      });

      // get location
      await page.waitForSelector(".content-block-list");
      let location = await page.evaluate(() => {
        let text = document.querySelector(".content-block-list");
       return text ? text.innerText.match(/[a-zA-Z-]+\s[a-zA-Z0-9]+\n+[a-zA-Z0-9]+\s[a-zA-Z]+/gm) : null;
      });
      await page.waitForSelector(".button");
      let applyLink = await page.evaluate(() => {
        let text = document.querySelector(".button");
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

gesundheit();
