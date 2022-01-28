import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let good = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
// "https://www.marien-hospital-dueren.de/index.php?id=140&seite=1",
    await page.goto(
    "https://www.marien-hospital-dueren.de/index.php?id=140&seite=2&inarchiv=2021",
   {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".newWindow.newslink")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        city: "duren",
        title: "",
        location: "Hospitalstraße 44 52353 Düren",
        hospital: "St. Marien-Hospital Düren ",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine-Westphalia",
        email: "",
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
    let emi = document.body.innerText.match(/\w+.\w+@\w+.\w+.\w+./g);
     return emi[0]

  });

// get location
// job.location = await page.evaluate(() => {
// let loc = document.querySelector(".grid3").innerText;
// loc = loc.replace("\n", " ");
// return loc.replace(/[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.].+/, "");
// });  
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

      // let link = await page.evaluate(() => {       
      //      return document.body.innerText.match(/\w+@\w+\.\w+/);      });
      //       if (typeof link == "object") { job.link = link;}
    //   let link = await page.evaluate(() => {
    //     return document.querySelector("#c1556 > div > div > div > div > div.btn-toolbar > a:nth-child(3)").href;
    //   });
    //   job.link = link
      // if (typeof link == "object") {
      //   job.link = link[0];
      // }

      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector('.newWindow.newslink')
          return applyLink ? applyLink.href : ""
        })
        job.link = link;
      } else {
        job.link = jobLink
      }
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





