import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const panklinik = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    let url = "https://www.pan-klinik.de/stellenangebote/";
    await page.goto(url, { timestamp: 0, waitUntil: "load" });
    //TODO:scroll
    await scroll(page);
    //TODO: get all jobs
    let links = await page.evaluate(() => {
      let halfJobs = Array.from(document.querySelectorAll(".bluetext > a")).map(
        (el) => el.href
      );
      let restHalf = Array.from(
        document.querySelectorAll(".inner > p > a")
      ).map((el) => el.href);

      let jobLinks = [];
      halfJobs.length > 0 ? jobLinks.push(...halfJobs) : (halfJobs = []);
      restHalf.length > 0 ? jobLinks.push(...restHalf) : (restHalf = []);
      return jobLinks;
    });
    for (let link of links) {
      let job = {
        title: "",
        location: "Köln",
        hospital: "PAN Klinik Am Neumarkt",
        link: "",
        level: "",
        position: "",
      };
      await page.got(link, { timeout: 0, waitUntil: "load" });
      await page.waitForTimeout(5000);

      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
    }

    //TODO: geta ll jobs details
  } catch (err) {
    console.log(err);
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
