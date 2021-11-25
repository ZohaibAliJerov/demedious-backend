import puppeteer from "puppeteer";

const nrkAarchecn = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  let url = "http://nrk-aachen.de/nrk-aachen-jobs/";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

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

  let jobs = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        "div.column.dt-sc-full-width.first > ul > li > a"
      )
    ).map((el) => el.href);
  });

  //visit all jobs
  let allJobs = [];
  for (let job of jobs) {
    await page.goto(job, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(1000);
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
    let title = await page.evaluate(() => {
      let _title = document.querySelector("div.dt-sc-callout-box.type1 > h4");
      return _title ? _title.innerText : "";
    });

    let location = await page.evaluate(() => {
      let _location = document.querySelector(
        "div.dt-sc-callout-box.type1 > h5"
      );
      return _location ? _location.innerText : "";
    });

    let cell = "";
    let email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@\w+-\w+\.\w+/);
    });

    let applyLink = email;
    allJobs.push({ title, location, cell, email, applyLink });
  }
  return allJobs;
};

export default nrkAarchecn;
