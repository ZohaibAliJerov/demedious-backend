import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
let obehausen = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    await page.goto("https://www.helios-gesundheit.de/kliniken/oberhausen/unser-haus/karriere/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
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
        city : "Oberhausen",
        hospital: "Helios St. Elisabeth Klinik Oberhausen",
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
  let eml = document.getElementsByTagName("p")[10].innerText.slice(134)
  return eml ? eml.innerText : "";
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
obehausen()
export default obehausen()