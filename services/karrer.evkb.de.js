
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let Karrer_evkb = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://karriere.evkb.de/stellenboerse.html?", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);
    
    await page.waitForSelector('.job-offer a')
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('.job-offer a')
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Evangelisches Klinikum Bethel",
        link: "",
        level: "",
        position: "",
        city: "Bielefeld",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      const location = await page.evaluate(() => {
        let loc = document.body.innerText.match(/Bi[A-Za-z]+ [A-Za-z]+|Bi[A-Za-z]+/)
        return loc;
      });
      job.location = location

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
    //   job.email = await page.evaluate(() => {
    //     return document.body.innerText.match(/[a-zaA-Z]+ [a-zaA-Z]+/);
    //   });
  
    //   job.email = email

    //   getting applylink
      let link = page.evaluate(()=> {
          let Link = document.querySelector('.kein-mitarbeiter.button.btn.btn-default');
          return Link ? Link.href : ""
      })
      job.link = link
    //   job.link = jobLink;

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


// Karrer_evkb()
export default Karrer_evkb;



