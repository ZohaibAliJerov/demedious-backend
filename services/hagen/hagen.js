import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];

let hagen = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto(
    "https://www.vamed-gesundheit.de/kliniken/hagen-ambrock/unsere-klinik/stellenangebote/",
    "https://www.vamed-gesundheit.de/kliniken/hagen-ambrock/unsere-klinik/stellenangebote/?tx_heliosuwsjoboffers_joboffers%5B%40widget_0%5D%5BcurrentPage%5D=2&cHash=f550286b88e66c6bc46aa52fe4d8060b",
    "https://www.vamed-gesundheit.de/kliniken/hagen-ambrock/unsere-klinik/stellenangebote/?tx_heliosuwsjoboffers_joboffers%5B%40widget_0%5D%5BcurrentPage%5D=3&cHash=9d3f5ce6e45f27a8266fe70f19203647",

     {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".tabular-list__link")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Hagen",
        hospital: "VAMED Klinik Hagen-Ambrock",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"
      ) {
        job.position = "artz";  
      }
      if (position == "pflege" || (position == "Pflege" && !level in levels)) {
        job.position = "pflege";
        job.level = "Nicht angegeben";
      }

      if (!position in positions) {
        continue;
      }
      let link = await page.evaluate(() => {
        let lnk = document.querySelector(".block-text p > a");
        return lnk ? lnk.href : ""
      });
      job.link = link;
      allJobs.push(job);
    }
    console.log(allJobs);
    return allJobs.filter((job) => job.position != "");
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
hagen()
export default hagen;