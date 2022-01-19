
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let Karrer_evkb = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    let allJobsLinks = []
    let allLinks = [
      "https://www.johanniter.de/johanniter-kliniken/ev-krankenhaus-bethesda-moenchengladbach/karriere/offene-stellen/?page=1&cHash=c9e9ec0b2164ae1357df7009e0dd341b",
      "https://www.johanniter.de/johanniter-kliniken/ev-krankenhaus-bethesda-moenchengladbach/karriere/offene-stellen/?page=2&cHash=9045079842118667c15e5eb0262b13e6",
      "https://www.johanniter.de/johanniter-kliniken/ev-krankenhaus-bethesda-moenchengladbach/karriere/offene-stellen/?page=3&cHash=e0a3061f74d1921ecc343be30579f521",
    ];

    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      // get all job links
      const jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll('.c-content-list__text > h3 > a')
        ).map((el) => el.href);
      });
      console.log(jobLinks);
      allJobsLinks.push(...jobLinks);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    console.log(allJobsLinks);


    let allJobs = [];

    for (let jobLink of allJobsLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Evangelisches Krankenhaus Bethesda Mönchengladbach",
        link: "",
        level: "",
        position: "",
        city: "Mönchengladbach",
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
        let text = document.querySelector(".o-grid__row");
        return text ? text.innerText.match(
          /[a-zA-Z-.].+\d+[\n]\w+[-.]\d+ [a-zA-Z-.].+/
        )
          : null;
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
      let email = await page.evaluate(() => {
        let text = document.querySelector("div.o-grid__row");
        return text ? text.innerText.match(
            /[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          )
          : null;
      });

      job.email = email

      //   getting applylink
      // let link = page.evaluate(() => {
      //   let Link = document.querySelector('a.c-button.c-button--main.c-button--large');
      //   return Link ? Link.href : "";
      // })
      // job.link = link
        job.link = jobLink;

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

Karrer_evkb()
// export default Karrer_evkb;




