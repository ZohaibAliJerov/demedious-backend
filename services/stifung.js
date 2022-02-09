import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let stifiungTan = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto(
      "https://stiftung-tannenhof-karriere.dvinci-easy.com/de/jobs",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    await page.waitForSelector("a.dvinci-job-position.ng-binding");
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("a.dvinci-job-position.ng-binding")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital:
          "Evangelische Stiftung Tannenhof - Fachkrankenhaus für Psychiatrie, Psychotherapie, Psychosomatik und",
        link: "",
        level: "",
        position: "",
        city: "Remscheid",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".default-design-box h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      //   job.location = await page.evaluate(() => {
      //     let loc = document.querySelector(".sidebar-widget").innerText;
      //     loc = loc.replace("\n", " ");
      //     return loc.replace(/\w+@\w+\.\w+/, "");
      //   });

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
      //     return document.body.innerText.match(/\w+@\w+\.\w+/);
      //   });
      //   if (typeof job.email == "object") {
      //     job.email = job.email[0];
      //   }

      let link = page.evaluate(() => {
        let Link = document.querySelector(".btn.btn-primary");
        return Link ? Link.href : "";
      });
      job.link = link;
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
stifiungTan();
