import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const johanniter = async () => {
  try {
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();
    let url =
      "https://www.johanniter.de/johanniter-kliniken/neurologisches-rehabilitationszentrum-godeshoehe/karriere/";

    await page.goto(url, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(3000);
    //remove the dialog box
    await page.waitForSelector("#uc-btn-accept-banner");
    await page.click("#uc-btn-accept-banner");

    await page.waitForTimeout(1000);
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
        setTimeout(10000);
      }
    });
    //get all pages
    let pages = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".c-pagination__list > li > a")
      ).map((el) => el.href);
    });

    //get all job links
    let allJobLinks = [];
    for (let pg of pages) {
      //visit each page
      await page.goto(`${pg}`, { timeout: 0, waitUntil: "load" });
      //scroll the each page
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

          setTimeout(1000);
        }
      });

      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.c-content-list__text > h3 > a")
        ).map((el) => el.href);
      });
      allJobLinks.push(...jobLinks);
    }

    // get all job details
    let allJobs = [];
    //visit all job links
    for (let link of allJobLinks) {
      await page.goto(link, { waitUntil: "load", timeout: 0 });
      await page.waitForTimeout(3000);
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
          setTimeout(1000);
        }
      });
      let job = {
        title: "",
        location: "",
        hospital: "Neurologisches Rehabilita ",
        link: "",
        level: "",
        position: "",
        city: "Bonn",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.waitForSelector("h1");
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });

      job.location = await page.evaluate(() => {
        return document.querySelector(".c-contact__content").innerText;
      });

      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      if (typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
      }
      job.link = await page.evaluate(() => {
        return document.querySelector(
          ".c-button.c-button--main.c-button--large"
        ).href;
      });
      //get level and position
      let text = job.title;
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
      allJobs.push(job);
    }
    await page.close();
    await browser.close();
    return allJobs;
  } catch (error) {
    console.log(error);
  }
};

export default johanniter;
