import puppeteer from "puppeteer";


let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];
const kreis_krankenhaus = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  // await page.goto(
    //   'https://www.kkhm.de/karriere/stellenanzeigen/#c622'
    //   )
  page.setDefaultNavigationTimeout(0);

  let allJobs = [];
  let allLinks = [
      "https://www.kkhm.de/karriere/stellenanzeigen/#c622"
    ];
  let counter = 0;
  do {
    await page.goto(allLinks[counter], {
      timeout: 0
    });
    scroll(page);
    // get all job links

    const jobs = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".teaser > header > h3 > a")
      ).map(el => el.href);
    });

    allJobs.push(...jobs);
    counter++;
    // await page.waitForTimeout(3000);
  } while (counter < allLinks.length);
  console.log(allJobs);

  const allJobsDetails = [];
  for(let i = 0; i < allJobs.length; i++) {
    let job = {
        title: "",
        location: "Sundern (Sauerland)",
        hospital: "Neurologische Klinik Sorpe",
        link: "",
        level: "",
        position: "",
    };
    await page.goto(allJobs[i]);
    scroll(page);
    // await page.waitForSelector("h3");

    let title = await page.evaluate(() => {
      let title = document.querySelector("article > header > h3");
      return title ? title.innerText : null;
    });
    job["title"] = title;

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
        level == "Assistenzarzt"
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
        let link = document.querySelector('div.news-text-wrap p > a')
        return link ? link.href : null
      });
    //   if (typeof link == "object") {
    //     job.link = link[0];
    //   }
    job.link = link

    allJobsDetails.push(job);
  }

  console.log(allJobsDetails);

  await page.close();
  await browser.close();
return allJobsDetails.filter((job) => job.position != "");
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
kreis_krankenhaus()

