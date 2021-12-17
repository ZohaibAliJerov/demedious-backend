import puppeteer from "puppeteer";

let positions = ["artz", "pflege"];
let levels = ["Fachartz", "Chefarzt", "Assistenzarzt"];

let job = {
  title: "",
  location: "Sundern (Sauerland)",
  hospital: "Neurologische Klinik Sorpe",
  link: "",
  level: "",
  position: "",
};
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
      if (job.title.search(positions[0])) {
        job.position = positions[0];
      } else if (job.title.search([positions[1]])) {
        job.position = positions[1];
      } else {
        continue;
      }
      //TODO: get level
      //TODO: get link
      console.log(job);
      allJobs.push(job);
      break;
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
