import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let guterlosh = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.klinikum-guetersloh.de/beruf-und-karriere/stellenangebote/aerztlicher-dienst/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".odd a")
      ).map((el) => el.href);
    });
    const jobLinks1 = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".even a")
        ).map((el) => el.href);
      });

      jobLinks.push(...jobLinks1)
    console.log(jobLinks);
    // console.log(jobLinks1);

    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Reckenberger Gutersloh",
        hospital: "Klinikum Gutersloh",
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
        let ttitle = document.querySelector("#c400 > div > div > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;
    //   console.log(title);

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

      let link = await page.evaluate(() => {
        let lnk = document.querySelector(".tx-jppageteaser-pi1-list-entry-description a");
        return lnk ? lnk.href : "";
      });
      job.link = link;
      // console.log(link);

      //get link
    //   let link = await page.evaluate(() => {
    //     return document.body.innerText.match(/\w+@\w+\.\w+/);
    //   });
    //   if (typeof link == "object") {
    //     job.link = link[0];
    //   }
      // console.log(job);
      allJobs.push(job);
      console.log(job);
    }
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
guterlosh();
export default guterlosh;
