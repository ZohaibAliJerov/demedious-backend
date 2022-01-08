import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const procelis = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();

  let url = "https://www.proselis.de/karriere/stellenmarkt";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".tx-rssdisplay > a ")).map(
      (el) => el.href
    );
  });
  //slice the links
  links = links.slice(0, 10);
  //get all job details
  let allJobs = [];
  for (let link of links) {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "Recklinghausen",
      hospital: "Prosper-Hospital Reckling",
      link: "",
      level: "",
      position: "",
    };
    await scroll(page);
    job.title = await page.evaluate(() => {
      return document.querySelector("h1").innerText;
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
    job.link = await page.evaluate(() => {
      return document.querySelector(".div-apply > a").href;
    });
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

export default procelis;
