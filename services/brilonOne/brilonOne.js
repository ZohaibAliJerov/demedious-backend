import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let brilon = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto("https://karriere.krankenhaus-brilon.de/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks

    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("#blockContentInner > div.elementSection.elementSection_var0.elementSectionPadding_var0.elementSectionMargin_var0.elementSectionInnerWidth_var90 > div > div > div.col.col1 > div > div.elementLink.elementLink_var10000.elementLinkPosition_var30 > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Schönschede 1 59929 Brilon",
        city: "Brilon",
        hospital: "Städtisches Krankenhaus Maria-Hilf Brilon",
        link: "",
        level: "",
        position: "",
        email: "",
        republic: " North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("div.elementHeadline.elementHeadline_var0.elementHeadlineAlign_var0.elementHeadlineLevel_varh1 > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get email
      let email = await page.evaluate(()=>{
        let eml = document.querySelector("a.wpst");
        return eml ? eml.innerText : "";
      })
      job.email = email;
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"||
        level == "Arzt"||
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
      //applyLink
      let link = await page.evaluate(()=>{
        let loc = document.querySelector("div.elementLink.elementLink_var10000.elementLinkPosition_var30 > a")
        return loc ? loc.innerText : "";
      })
      job.link = jobLink;
      allJobs.push(job);
    }
    console.log(allJobs);
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
brilon();
export default brilon;
