import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let good = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.gelderlandklinik.de/arbeit-karriere/stellenangebote-auf-dem-gesundheitscampus-geldern?tx_dg_stellenboerse_stellen%5Baction%5D=test&tx_dg_stellenboerse_stellen%5Bcontroller%5D=test&cHash=bbe5950cd222c16a790c630379b2054d", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".stelle a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        city:"Gelderland Clinic Geldern",
        title: "",
        location: "Clemensstraße 647608 Geldern",
        hospital: "Gelderland Clinic Clemensstrasse 10 47608 Geldern",
        link: "",
        level: "",
        position: "",
        republic:"North Rhine-Westphalia",
        email: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : null;
      });
      job.title = title;
  // get email
  job.email = await page.evaluate(() => {
    return document.body.innerText.match(/[a-zA-Z-. ]+[(][\w]+[)]\w+.\w+|[a-zA-Z-. ]+@\w+./);
   }); 
    // get location
  // job.location = await page.evaluate(() => {
  // let loc = document.querySelector(".arbeitsort").innerText;
  // return loc.match(/[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.].+/, "");
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
      let link = await page.evaluate(() => {
       let app = document.querySelector("#stellen-show > div.btn-toolbar > a.btn.online-formular.pull-right");
       return app ? app.href :null
      });
      job.link = link
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





