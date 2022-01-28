import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let DrBeaker = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    let alljobsLinks = [];
    let allLinks = ["https://dr-becker-karriere.de/jobs/?filter[client_id][]=2&%20filter[client_id][]=3&filter[client_id][]=4&filter[client_id][]=5&filter[client_id][]=6&filter[client_id][]=8&filter[client_id][]=9&filter[client_id][]=13&filter[client_id][]=14&filter[client_id][]=15&filter[client_id][]=16&filter[client_id][]=17"]

    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      //get all job links
    //   await page.waitForSelector()
      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".joboffer_title_text.joboffer_box a")
        ).map((el) => el.href);
      });
      alljobsLinks.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks);
    //console.log(allJobs);

    console.log(alljobsLinks);

    let allJobs = [];

    for (let jobLink of alljobsLinks) {
      let job = {
        title: "",
        location: "Horn - Bad Meinberg",
        hospital: "Dr. Becker Brunnen-Klinik",
        city: "North Rhine-Westphalia",
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
        let ttitle = document.querySelector(".scheme-content.scheme-title > h1 ");
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

      //get email 
      let email = await page.evaluate(()=> {
          return document.body.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/)
      })
      job.email = email

      //get link
      let link = await page.evaluate(() => {
        let applyLink = document.querySelector('.css_button a');
        return applyLink ? applyLink.href: "";
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

DrBeaker()
// export default aatalklinik;

