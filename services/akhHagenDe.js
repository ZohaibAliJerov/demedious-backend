import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let AkhHagen = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    let alljobsLinks = [];
    let allLinks = ["https://www.akh-hagen.de/karriere/stellenangebote#sr",
    "https://www.akh-hagen.de/karriere/stellenangebote/page/2?cHash=fe24ea08de7c02a724b2f538f77f0224#sr"
    ]

    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      //get all job links
    //   await page.waitForSelector()
      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".col-xs-12 > h4 a")
        ).map((el) => el.href);
      });
      alljobsLinks.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    //console.log(allJobs);

    console.log(alljobsLinks);

    let allJobs = [];

    for (let jobLink of alljobsLinks) {
      let job = {
        title: "",
        location: "Hagen",
        hospital: "Agaplesion Allgemeines Krankenhaus Hagen",
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
        let ttitle = document.querySelector(".col-md-10.col-xs-12 h1");
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

      //get link
      let link = await page.evaluate(() => {
        let applyLink = document.querySelector('.news-text-wrap.col-md-8.col-xs-12');
        return applyLink ? applyLink.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/): "";
      });
        job.link = link;
    
      // console.log(job);
      allJobs.push(job);
    }
    console.log(allJobs)
    await browser.close();
    await page.close()
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

AkhHagen()
// export default aatalklinik;

