import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const rheinlandklinikum = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();

  let url = "https://karriere.rheinlandklinikum.de/jobs";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  //get links titles, locations, hospitals
  let [titles, locations, hospitals] = await page.evaluate(() => {
    let text = Array.from(document.querySelectorAll(".portfolio-desc"))
      .map((el) => el.innerText)
      .map((el) => el.split("\n"));
    let titles = text.map((el) => el[0]);
    let locations = text.map((el) => el[1]);
    let hospitals = text.map((el) => el[3]);
    return [titles, locations, hospitals];
  });

  console.log(titles);
  console.log(locations);
  console.log(hospitals);
  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".portfolio-desc >  h3 > a")
    ).map((el) => el.href);
  });
  //slice the links
  //get all job details
  let allJobs = [];
  let counter = 0;
  for (let link of links) {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    let job = {
      title: "",
      location: "",
      hospital: "",
      link: "",
      level: "",
      position: "",
      city: "Würselen",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = titles[counter];
    job.hospital = hospitals[counter];
    job.location = locations[counter];
    let text = await page.evaluate(() => {
      return document.body.innerText;
    });
    counter++;
    job.email = text.match(/\w+@\w+\.\w+/);
    if (typeof job.email === "object" && job.email != null) {
      job.email = job.email[0];
    }
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
  let res = await rheinlandklinikum();
  console.log(res);
})();
