import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let good = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.krankenhaus-linnich.de/index.php?id=468&seite=1",
    "https://www.krankenhaus-linnich.de/index.php?id=468&seite=2&inarchiv=2021",
    "https://www.krankenhaus-linnich.de/index.php?id=468&seite=3&inarchiv=2021", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".grid7 a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        city:"linnich",
        title: "",
        location: "St. Josef-Krankenhaus Rurdorfer Straße 49, 52441 Linnich.",
        hospital: "St. Josef-Krankenhaus Linn",
        link: "",
        level: "",
        position: "",
        republic:"North Rhine-Westphalia",
        email: ""
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h3");
        return ttitle ? ttitle.innerText : null;
      });
      job.title = title;
// get email
job.email = await page.evaluate(() => {
  return document.body.innerText.match(/[a-zA-Z-. ]+[(][\w]+[)]\w+.\w+|[a-zA-Z-. ]+@[a-zA-Z-. ]+/);
 });
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/|"Arzt"|"Oberarzt");
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"
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
 // get link
 let link1 = 0;
 if (link1) {
   const link = await page.evaluate(() => {
     let applyLink = document.querySelector('.name a')
     return applyLink ? applyLink.href : ""
   })
   job.link = link;
 } else {
   job.link = jobLink
 }
      // get link
      // let link = await page.evaluate(() => {
      //   return document.querySelector(".bodytext").href;
      // });
      // job.link = link
      // if (typeof link == "object") {
      //   job.link = link[0];
      // }
      allJobs.push(job);
    }
    console.log(allJobs);
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

good()





