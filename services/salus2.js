import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const salus2 = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();

  let url =
    "https://www.salus-kliniken.de/aktuelles/karriere-und-beruf/list/huerth/";
  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);

  //get all links
  let pages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".pagination > li > a")).map(
      (el) => el.href
    );
  });
  let links = [];
  for (let pg of pages) {
    await page.goto(pg, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    await scroll(page);
    let jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".list-item-header > a")).map(
        (el) => el.href
      );
    });
    links.push(...jobLinks);
  }
  print(links);
  //get all job details
  let allJobs = [];
  for (let link of links) {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "",
      hospital: "salus klinik Hürth",
      link: "",
      level: "",
      position: "",
      city: "Hürth",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = await page.evaluate(() => {
      return document.querySelector("h2.fgColorOverride").innerText;
    });
    job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@.*\.\w/).toString();
    });
    job.location = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".news.news-single > p"))
        .map((el) => el.innerText)[1]
        .split("\n")
        .slice(0, 3)
        .join(" ");
    });
    let text = await page.evaluate(() => {
      return document.body.innerText;
    });

    //get level and positions
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
    job.link = link;
    if (typeof job.link == "object") {
      job.link = job.link[0];
    }
    allJobs.push(job);
  } //end of for loop
  await page.close();
  await browser.close();
  return allJobs;
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

// export default wessel;
(async () => {
  let res = await salus2();
  console.log(res);
})();

function print(...args) {
  console.log(...args);
}
