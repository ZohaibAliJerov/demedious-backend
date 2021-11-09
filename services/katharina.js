import puppeteer from "puppeteer";

const katharina = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto(
      "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=3"
    );
    await page.waitForNavigation();
    await page.screenshot({ path: "katharina.png" });
    await scroll(page);
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
      await scroll(page);
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

(async () => {
  katharina();
})();
