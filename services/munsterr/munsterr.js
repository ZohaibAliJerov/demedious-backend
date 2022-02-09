import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let munsterr = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.ukm.de/index.php?id=ukmstellen", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.content.articletype-0 > h3 > a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Domagkstraße 5 48149 Münster",
        hospital: "Universitätsklinikum Münster",
        link: "",
        level: "",
        position: "",
        city: "Münster",
        email: "",
        republic: "Irish republicans",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("div.article > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;
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

      //get email
      let email = await page.evaluate(() => {
        let eml = document.querySelector("div.text > p > a");
        return eml ? eml.innerText : "";
      });
    job.email = String() + email;

      job.link = jobLink;

      allJobs.push(job);
    }
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
munsterr()
export default munsterr;
