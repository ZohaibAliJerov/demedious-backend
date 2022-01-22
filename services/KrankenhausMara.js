import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
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
  };
let KrankenhausMara = async () => {
  try {
    let browser = await puppeteer.launch({
      headless:false,
    });

    let page = await browser.newPage();

    await page.goto("https://karriere.evkb.de/stellenboerse.html?stadt=1", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.job-offer > a"))
      .map((el) => el.href);
    });
await page.waitForTimeout(2000)
    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Krankenhaus Mara",
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
        let ttitle = document.querySelector('header >  h1')
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector('div.col-12.col-lg-3.jobInfoFacts > p:nth-child(3)').innerText;
        loc = loc.replace("\n", " ");
        return loc.replace(/\w+@\w+\.\w+/, "");
      });

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
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      if (typeof job.email == "object") {
        job.email = "" + job.email
      }
      let link = await page.evaluate(() => {
        let apply = document.querySelector('a.kein-mitarbeiter.button.btn.btn-default')
        return apply ? apply.href : null;

    })
      job.link = link;
      
      allJobs.push(job);
    }
    await page.waitForTimeout(3000)
    console.log(allJobs);
    await browser.close()
    // await page.close()
    return allJobs.filter((job) => job.position != "");
  } catch (e) {
    console.log(e);
  }
};



