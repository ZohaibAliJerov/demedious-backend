import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let fun = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.teildesganzen-alltagshelden.de/stellenanzeigen-aerzte.html", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
    await page.waitForSelector('.item-rightside');

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".item-rightside a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Bieledeld",
        hospital: "Kilinikum Bieledeld",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(3000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".single-top h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;
    //   document.write(title);


      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
    //   document.write(title);
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
      let link = await page.evaluate( () =>{
        let link = document.querySelector('.single-top-content a')
        return link ? link.href : "";
    })
    job.link= link;

    let ltext = await page.evaluate(() => {
       return document.body.innerText;
     });
    //   let link = await page.evaluate(() => {
    //     return document.body.innerText.match(/\w+@\w+\.\w+/);
    //   });
    //   if (typeof link == "object") {
    //     job.link = link[0];
    //   }
      console.log(job);
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
fun();
export default fun;
