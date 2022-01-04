import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt","Arzt", "Oberarzt"];

let bochumLinden = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto(
      "https://www.helios-gesundheit.de/kliniken/bochum-linden/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
        let  a = document.querySelector(".menu__link")
        a.click()

       let navigate =  document.querySelector(".menu__link").onclick = function () {
            window.location.href = "/kliniken/bochum-linden/unser-angebot/";
        };
        navigate()
        
        let nevgte = document.querySelector('#main > section.panel > div > div.teaser-panel__item > div > div > div > div:nth-child(2) > a').onclick = function () {
            window.location.href = "/kliniken/bochum-linden/unser-haus/karriere/stellenangebote/"
        }
        nevgte()
      return Array.from(document.querySelectorAll("article.tabular-list__item > a ")).map(el => el.href)
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Bochum-Linden",
        hospital: "Helios St. Josefs-Hospital",
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
        let ttitle = document.querySelector("h2.billboard-panel__title");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"||
        level =="Arzt"||
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
        let lnk = document.querySelector(".button-form");
        lnk.click()
        let apply = document.querySelector("div.dialog__content > a")
        return apply ? apply.href : "";
      });
      job.link = link;
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
bochumLinden();
export default bochumLinden;