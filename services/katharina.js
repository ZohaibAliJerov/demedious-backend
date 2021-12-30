import puppeteer from "puppeteer";

const katharina = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto(
      "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=3"
    );

    await page.screenshot({ path: "katharina.png" });
    await scroll(page);
    //get all jobsLinks
    await page.waitForSelector(".joboffer_title_text > a");
    let allJobLinks = await page.evaluate(() => {
      let jobLinks = document.querySelectorAll(".joboffer_title_text > a");
      return jobLinks ? [...jobLinks].map((link) => link.href) : [];
    });

    //get all jobs
    let allJobs = [];
    for (let jobLink of allJobLinks) {
      await page.goto(jobLink, { waitUntil: "load", timeout: 0 });

      await page.waitForTimeout(1000);
      await scroll(page);
      await page.waitForTimeout(1000);
      let newJob = {};
      newJob.title = await page.evaluate(() => {
        let title = document.querySelectorAll("h1");
        return title ? [...title][1].innerText : "";
      });
      await page.waitForSelector(".content_text");
      newJob.address = await page.evaluate(() => {
        let address = Array.from(document.querySelectorAll(".content_text"));
        address = address[4].innerText;
        return address
          .split("\n")
          .join(",")
          .replace(/\+\d+\s+\d+\s\d+-\d+|,,/g, " ");
      });
      let cell = await page.evaluate(() => {
        let cellNo = Array.from(document.querySelectorAll(".content_text"));
        return cellNo ? cellNo[4].innerText.match(/\+\d+\s+\d+\s\d+-\d+/) : "";
      });
      if (typeof cell == "object" && cell != null) {
        cell = cell[0];
      } else if (cell == null) {
        cell = "";
      }
      newJob.cell = cell;
      newJob.email = "";

      let applyLink = await page.evaluate(() => {
        let link = document.querySelector("#btn_online_application > a");
        return link ? applyLink.href : "";
      });

      if (typeof applyLink == "object" && applyLink != null) {
        applyLink = applyLink[0];
      } else if (applyLink == null) {
        applyLink = "";
      }
      newJob.applyLink = applyLink;
      allJobs.push(newJob);
    }

    await page.close();
    await browser.close();
    return allJobs;
  } catch (error) {
    console.log(error);
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

export default katharina;
