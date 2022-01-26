import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let weidenauer = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto(
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/",
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/?tx_news_pi1%5B%40widget_0%5D%5BcurrentPage%5D=2&cHash=cc76a9aac54932571a8b33a7f7c39d7c",
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/?tx_news_pi1%5B%40widget_0%5D%5BcurrentPage%5D=3&cHash=940e1d4044f01c1a7bf0d3af9039b908",
      "https://www.kreisklinikum-siegen.de/mitarbeiter-karriere/karriere/stellenangebote/?tx_news_pi1%5B%40widget_0%5D%5BcurrentPage%5D=4&cHash=818d07e9becba43e82851c71a6099ea5",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.header > h3 > a ")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Weidenauser",
        hospital: "kreisklinikum-siegen",
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
        let ttitle = document.querySelector("div.header > h3");
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
      let link = await page.evaluate(() => {
          let apply = document.querySelector(".mail")
          return  apply ? apply.innerText : "";
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
weidenauer();
export default weidenauer;
