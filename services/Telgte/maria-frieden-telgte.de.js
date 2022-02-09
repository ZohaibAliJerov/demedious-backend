import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];

let klinikLindenplatzDe = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto(
      "https://www.maria-frieden-telgte.de/karriere/stellenmarkt.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".grid a")).map(
        (el) => el.href
      );
    });

    let jobLinksOO = [
      jobLinks[0],
      jobLinks[2],
      jobLinks[4],
      jobLinks[6],
      jobLinks[8],
      jobLinks[10],
      jobLinks[12],
      jobLinks[14]

    ];

    console.log(jobLinksOO);
    // console.log(jobLinksOO)
    // console.log("asas")
    let allJobs = [];

    for (let jobLink of jobLinksOO) {
      let job = {
        title: "",
        location: "Telgte",
        hospital: "Klinik Maria Frieden",
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
        let ttitle = document.querySelector(".header h2");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;
    //   console.log(title);

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

      // get link

      let link = await page.evaluate(() => {
        let lnk = document.querySelector(".article a");
        return lnk ? lnk.href : null;
      });
      job.link = link;
      // console.log(link);

      // let link = await page.evaluate(() => {
      //   return document.body.innerText.match(/\w+@\w+\.\w+/);
      // });
      // if (typeof link == "object") {
      //   job.link = link[0];
      // }
      allJobs.push(job);
      console.log(job);
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

klinikLindenplatzDe();

export default klinikLindenplatzDe;
