
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let celenusKerrier = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    let links = [
      'https://www.klinik-hilchenbach.de/karriere/',
      'https://www.celenus-karriere.de/jobs/aktuellejobs/aerzte/',
      'https://www.celenus-karriere.de/salvea/aktuellejobs/aerzte/'
    ]
    let jobLinks = []
    let counter = 0
    do {
        await page.goto(links[counter], { timeout: 0 });
        scroll(page);
       // get all jobs links 
       let jobs = await page.evaluate(() => {
              return Array.from(
                document.querySelectorAll('.ce-bodytext > ul > li > a')
              ).map((el) => el.href)
            });
            jobLinks.push(...jobs)
      
            counter++;
            await page.waitForTimeout(3000);
          } while (counter < links.length);
         console.log(jobLinks)
    
  
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Hilchenbach",
        hospital: "CELENUS Fachklinik Hilche",
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
        let ttitle = document.querySelector(".nc-stelle-top > h1");
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
        let link1 = document.querySelector('.col.col-3-1.nc-sidebar > div.nc-action-button.nc-link-form a')
        return link1.href
      });
      if (typeof link == "object") {
        job.link = link;
      }
      // console.log(job);
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
celenusKerrier()

