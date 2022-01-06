import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const lymphklinik = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let url = "https://www.lymphklinik.com/karriere.html";
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
      }
    });

    let allJobs = [];
    //get all jobs
    let titles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tm-article > ul > li")).map(
        (el) => el.innerText
      );
    });
    let job = {
      title: "",
      location: "Bad Berleburg",
      hospital: "Ödemzentrum Bad Berleburg",
      link: "",
      level: "",
      position: "",
    };
    job.link = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@\w+\.\w+/);
    });
    if (typeof job.link == "object") {
      job.link = job.link[0];
    }
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

    for (let title of titles) {
      job.title = title;
      allJobs.push(job);
      console.log(job);
    }
    return allJobs;
  } catch (error) {
    console.log(error);
  }
};

export default lymphklinik;
