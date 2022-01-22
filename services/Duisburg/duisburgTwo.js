import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
let duisburg = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    await page.goto("https://www.helios-gesundheit.de/reha/rhein-klinik/unsere-klinik/karriere/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);

    //function for moving to next page
    await page.waitForTimeout(1000);

    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
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
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("article.tabular-list__item > a")
      ).map((el) => el.href);
    });
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        city : "Duisburg",
        hospital: "Helios Rhein Klinik Duisburg",
        link: "",
        email: "",
        level: "",
        position: "",
        republic: "North Rhine-Westphalia"
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      await page.waitForTimeout(1000);
      // title
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h2.billboard-panel__title");
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
await page.waitForSelector
let link = await page.evaluate(() => {
  let getLink = document.querySelector(".button-form");
  getLink.click();
    let applyLink = document.querySelector("a.button");
    return applyLink ? applyLink.href : null;
});
job.link = link
//get email 
let email = await page.evaluate(()=> {
  let eml = document.querySelector("#c74506 > div > section.content-block-list > div > article:nth-child(5) > div > div");
  return eml ? eml.innerText.match(/[a-zA-Z]+.[a-zA-Z-]+.[a-zA-Z]+.\[at\].[a-zA-Z-]+.[a-zA-Z.]+.[a-zA-Z]+./g) : "";
})
job.email = String() + email;
//get location
let location = await page.evaluate(()=>{
    let loc = document.getElementsByTagName("td")[1];
    return loc ? loc.innerText: null;
})
job.location = location
allJobs.push(job);
}
console.log(allJobs);
return allJobs.filter((job) => job.position != "");
};
} catch (e) {
    console.log(e);
    }
}
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
duisburg()
export default duisburg()