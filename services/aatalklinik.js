import puppeteer from "puppeteer";

let aatalklinik = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.aatalklinik.de/", {
      waitUntil: "load",
      timeout: 0,
    });

    await page.screenshot({ path: "aatalklinik.png" });
    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.shortcode-jobs > ul > li > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
      let newJob = {};
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1#page-title");
        return ttitle ? ttitle.innerText : "";
      });
      newJob.title = title;

      let { address, cell, email } = await page.evaluate(() => {
        let adrs = Array.from(
          document.querySelectorAll("div.sidebar-widget > p")
        ).map((el) => el.innerText);
        adrs = adrs.join("");

        let cellNo = adrs.match(/\d+\/\d+-\d+/);
        let mail = adrs.match(/\w+@\w+\.\w+/);
        adrs = adrs.split(",");
        adrs = adrs.map((el) => el.replace(/\w+@\w\.\w+|\d+\/\d+-\d+|\n/g, ""));
        return { address: adrs, cell: cellNo, email: mail };
      });

      newJob.address = address;
      newJob.cell = cell;
      newJob.email = email;
      newJob.applyLink = jobLink;

      allJobs.push(newJob);
    }
    return allJobs;
  } catch (e) {
    console.log(e);
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

export default aatalklinik;
