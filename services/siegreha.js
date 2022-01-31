import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const schoen = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();

  let url = "https://siegreha.de/aktuelle-stellenangebote/";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(3000);
  //get all links
  let links = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".et_pb_text_inner > ul > li")
    ).map((el) => {
      if (el) {
        return el.href;
      }
    });
  });
  if (links.length > 0) {
    print(links);
    //slice the links
    //get all job details
    let allJobs = [];
    for (let link of links) {
      await page.goto(link, { timeout: 0, waitUntil: "load" });
      await page.waitForTimeout(5000);
      let job = {
        title: "",
        location: "",
        hospital: "Schön Klinik Düsseldorf",
        link: "",
        level: "",
        position: "",
        city: "Düsseldorf",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await scroll(page);
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }
      job.location = await page.evaluate(() => {
        return document.querySelector(".scheme-additional-data").innerText;
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
  } else {
    return [];
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

function print(...args) {
  console.log(...args);
}

export default schoen;
