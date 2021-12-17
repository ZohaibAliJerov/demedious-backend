import puppeteer from "puppeteer";

let positions = ["artz", "pflege"];
let levels = ["Fachartz", "Chefarzt", "Assistenzarzt"];

let aatalklinik = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.aatalklinik.de/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.shortcode-jobs > ul > li > a")
      ).map((el) => el.href);
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

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1#page-title");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      //position
      if (job.title.toLocaleLowerCase.match(/artz/)) {
        job.position = "Artz";
      } else if (job.title.toLocaleLowerCase().match(/pflege/)) {
        job.position = "Pflege";
      } else {
        continue;
      }
      //get level
      if (job.title.match(/Fachartz/)) {
        job.level = "Fachartz";
      } else if (job.title.match(/Assistenzarzt/)) {
        job.level = "Assistenzarzt";
      } else if (job.title.match(/Chefarzt/)) {
        job.level = "Chefarzt";
      }
      //get link
      job.link = await page.evaluate(() => {
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      console.log(job);
      allJobs.push(job);
    }
    return allJobs;
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

// export default aatalklinik;

(async () => {
  await aatalklinik();
})();
