import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const praxiklinik = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();

  let url = "https://www.preventicum.de/karriere.html";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  //get all links
  let titles = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".newsbox > .ce_text.block > h1 ")
    ).map((el) => el.innerText);
  });
  titles = titles.map((el) => {
    return el.replace("GESUCHT:", "").trim();
  });
  //get all job details
  let allJobs = [];
  for (let title of titles) {
    let job = {
      title: "",
      location: "Essen",
      hospital: "Preventicum - Privatärztli",
      link: "",
      level: "",
      position: "",
    };
    job.title = title;
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
      return document.querySelector(".ce_text.block > h2").innerText;
    });
    job.link = job.link.replace("Jetzt bewerben:", "");
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

//export default praxiklinik;

(async () => {
  let res = await praxiklinik();
  console.log(res);
})();
