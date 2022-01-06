import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const lymphklinik = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let url = "https://www.lymphklinik.com/karriere.html";
    await page.goto(url, { timeout: 0, waitUntil: "load" });

    //scroll the page
    await page.evaluate(() => {
      for (let i = 0; i < 100; i++) {
        if (
          document.scrollingElement.scrollTop + window.innerHeight >=
          document.scrollingElement.scrollHeight
        ) {
          break;
        }
        document.scrollingElement.scrollBy(0, 100);
      }
    });

    let allJobs = [];
    //get all jobs
    let jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".tm-article > ul > li")).map(
        (el) => el.innerText
      );
    });

    let link = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@\w+\.\w+/);
    });

    //get level
    let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);

    for (let job of jobs) {
      allJobs.push({
        title: title,
        location: "Sundern (Sauerland)",
        hospital: "Neurologische Klinik Sorpe",
        link: link,
        level: level,
        position: position,
      });
      console.log(job);
    }
    return allJobs;
  } catch (error) {
    console.log(error);
  }
};

// export default lymphklinik;

(async () => {
  let res = await lymphklinik();
  console.log(res);
})();
