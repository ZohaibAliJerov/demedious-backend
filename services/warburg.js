import puppeteer from "puppeteer";
const warburg = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.helios-gesundheit.de/kliniken/warburg/unser-haus/karriere/stellenangebote//",
      "https://www.helios-gesundheit.de/kliniken/warburg/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=2&cHash=6ff29ba436dff093b32c89423cc9fe2a",
    ];
    let counter = 0;
    do {
      await page.goto(allLinks[counter], {
        timeout: 0,
      });
      scroll(page);
      //  get all job links
      let jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".tabular-list__link")).map(
          (el) => el.href
        );
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

      const title = await page.evaluate(() => {
        let text = document.querySelector(".billboard-panel__body > h2");
        return text ? text.innerText : null;
      });

      //get contacts
      let cell = await page.evaluate(() => {
        let text = document
          .querySelector(".content-block-list__container")
          .getElementsByTagName("article")[4];
        return text ? text.innerText.match(/\+\d{2}.\(\d{1}\).\d{4}.\d{2}.\d{4}|\(\d{5}\).\d{2}.\d{4}|\d{5}\/\d{6}|\d{5}.\d{7}/g) : null;
      });
      //     // get email
      let email = await page.evaluate(() => {
        let text = document
          .querySelector(".content-block-list__container")
          .getElementsByTagName("article")[4];
        return text
          ? text.innerText.match(/[a-z.]+[a-z]+.\[at].[a-z-]+[a-z.]+[a-z.]+/g)
          : null;
      });

      // get location
      let location = await page.evaluate(() => {
        let text = document
          .querySelector(".content-block-list")
          .getElementsByTagName("article")[4];
        return text
          ? text.innerText.match(
              /[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+.\n\s[a-zA-Z-]+.[a-zA-Z-]+.[a-zA-Z]+.\d+.\n\s\d+.[a-zA-Z]+.|[a-zA-Z-]+[a-zA-Z-]+[a-zA-Z.]+.\d{2}\,.\d{5}.[a-zA-Z]+|[a-zA-Z-]+[a-zA-Z-][a-zA-Z]\W{1}[a-zA-Z].\d+\,.\d+.[a-zA-Z.]+/g
            )
          : null;
      });

      //get apply link
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
warburg();
export default warburg
