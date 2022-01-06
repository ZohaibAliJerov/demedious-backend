import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
const octapharmaplasma = async () => {
  try {
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();
    let url = "https://www.octapharmaplasma.de/jobs";
    let locations = [];
    //visit the site
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    await page.waitForTimeout(3000);
    //remove the dialogue box
    await page.waitForSelector("div.ccm__cheading__close");
    await page.click("div.ccm__cheading__close");
    await page.waitForTimeout(1000);
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
        setTimeout(1000);
      }
    });
    //get all locations
    locations = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".card-header > h3")).map(
        (el) => el.innerText
      );
    });
    //get all jobLinks
    let jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.card-body > p > a"))
        .map((el) => el.href)
        .filter((el) => !el.includes("@"));
    });
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Sundern (Sauerland)",
        hospital: "Neurologische Klinik Sorpe",
        link: "",
        level: "",
        position: "",
      };
      await page.goto(jobLink, { waitUntil: "load", timeout: 0 });
      await page.waitForTimeout(1000);

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
          setTimeout(1000);
        }
      });

      //get title
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });
      job.link = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);

      allJobs.push(job);
    }
    return allJobs;
  } catch (error) {
    console.log(error);
  }
};
export default octapharmaplasma;
