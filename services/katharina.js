import puppeteer from "puppeteer";

const katharina = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto("https://www.katharina.de/");
    await page.waitForNavigation();
    await page.screenshot({ path: "katharina.png" });

    //get all jobsLinks
    let allJobLinks = await page.evaluate(() => {
      let jobLinks = document.querySelectorAll(".joboffer_title_text > a");
      return jobLinks ? jobLinks.map((link) => link.href) : [];
    });
    //get all jobs
    let allJobs = [];
    for (let jobLink of allJobLinks) {
      await page.goto(jobLink, { waitUntil: "load", timeout: 0 });
      await page.waitForNavigation();
      await page.waitForTimeout(1000);
      let newJob = {};
      newJob.title = await page.evaluate(() => {
        let title = document.querySelectorAll("h1");
        return title ? [...title][1] : "";
      });

      newJob.address = await page.evaluate(() => {
        let address = document.querySelectorAll(".content_text");
        return address
          ? toString([...address][4]).replace(/\+\d+\s+\d+\s\d+-\d+/, "")
          : "";
      });
      newJob.cell = await page.evaluate(() => {
        let cell = document.querySelectorAll(".content_text");
        return cell ? toString([...cell][4]).match(/\+\d+\s+\d+\s\d+-\d+/) : "";
      });
      newJob.email = null;

      newJob.applyLink = await page.evaluate(() => {
        let applyLink = document.querySelector("#btn_online_application");
        return applyLink ? applyLink.href : "";
      });

      allJobs.push(newJob);
    }

    await page.close();
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  katharina();
})();
