import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const panklinik = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let url = "https://www.pan-klinik.de/stellenangebote/";
    await page.goto(url, { timestamp: 0, waitUntil: "load" });
    //TODO:scroll
    await scroll(page);
    //TODO: get all jobs
    let links = await page.evaluate(() => {
      let halfJobs = Array.from(document.querySelectorAll(".bluetext > a")).map(
        (el) => el.href
      );
      let restHalf = Array.from(
        document.querySelectorAll(".inner > p > a")
      ).map((el) => el.href);

      let jobLinks = [];
      halfJobs.length > 0 ? jobLinks.push(...halfJobs) : (halfJobs = []);
      restHalf.length > 0 ? jobLinks.push(...restHalf) : (restHalf = []);
      return jobLinks;
    });
    let allJobs = [];
    for (let link of links) {
      let job = {
        title: "",
        location: "Köln",
        hospital: "PAN Klinik Am Neumarkt",
        link: "",
        level: "",
        position: "",
      };
      await page.got(link, { timeout: 0, waitUntil: "load" });
      await page.waitForTimeout(5000);
      await scroll(page);
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt" ||
        level == "Arzt" ||
        level == "Oberarzt"
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
      job.link = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@.+\.\w/);
      });

      allJobs.push(job);
    }

    return allJobs;
    //TODO: geta ll jobs details
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
