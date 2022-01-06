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
