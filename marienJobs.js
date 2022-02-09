import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let marienborn_jobs = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: true,
    });

    let page = await browser.newPage();

    await page.goto("https://www.marienborn-jobs.de/stellenangebote/", {
      waitForTimeout: 0,
    });

    await page.waitForTimeout(1000);
    await scroll(page);

    // get all job links
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".job-offers-list > ul > li a")
      ).map((el) => el.href);
    });
    console.log(jobLinks);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Luxemburger Str. 1, 53909 Zülpich, Germany",
        hospital:
          "Fachklinik für Psychiatrie und Psychotherapie der Marienborn",
        link: "",
        level: "",
        position: "",
        city: "Zülpich",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1.headline");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

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

      //get link
      job.email = await page.evaluate(() => {
        let text = document.querySelector(".bewerbung-content");
        return text ? text.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/) : null;
      });

      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }

      //   getting applylink
      let link = await page.evaluate(() => {
        let Link = document.querySelector(".button-jetzt-bewerben");
        return Link ? Link.href : "";
      });

      job.link = link;
      //    if(typeof job.link == "object") {
      //         job.link = job.link;
      //     }
      allJobs.push(job);
    }
    console.log(allJobs);
    await page.close();
    await browser.close();
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

// EvkWesel()
export default marienborn_jobs;
