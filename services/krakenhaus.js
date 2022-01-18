import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
const krankenhausBethanien = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: true,
    });
    let page = await browser.newPage();
    const jobLinks = [];
    let allUrls = ["https://jobs.diakonie-bethanien.de/jobs"];
    // all jobsLinks
    for (let a = 0; a < allUrls.length; a++) {
      await page.goto(allUrls[a]);
      scroll(page);
      let job = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".jobfeed-inner > a")).map(
          (el) => el.href
        );
      });
      jobLinks.push(...job);
    }
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Solingen",
        hospital: "Krankenhaus Bethanien ",
        link: "",
        level: "",
        position: "",
        email: "",
        city: "Solingen",
        republic: "North Rhine-Westphalia",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1#tms-job-title");
        return ttitle ? ttitle.innerText : null;
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
      let link = await page.evaluate(() => {
        let link = document.querySelector("div#tms-action-editor > a");
        return link ? link.href : null;
      });
      job.link = link;
      let email = await page.evaluate(() => {
        return document.body.innerText.match(
          /[a-zA-Z0-9-._+/]+@[a-zA-Z0-9-._+/]+\.[a-zA-Z0-9-]+/
        );
      });
      if (typeof email == "object") {
        job.email = "" + email;
      }
      // console.log(job);
      allJobs.push(job);
    }
    console.log(allJobs);
    await browser.close();
    // await page.close()
    return allJobs.filter((job) => job.position != "");
  } catch (err) {
    console.error(err);
  }
};
export async function scroll(page) {
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

export default krankenhausBethanien;
