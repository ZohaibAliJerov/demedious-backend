import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
let erkelenz = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();
    await page.goto("https://www.hjk-erkelenz.de/Mitarbeiter-Karriere-Ausbildung/Karriere/Offene-Stellen", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("div.headline > h3 > a")
      ).map((el) => el.href);
    });
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        city : "Erkelenz",
        hospital: "Hermann-Josef-Krankenhaus Erkelenz",
        link: "",
        email: "",
        level: "",
        position: "",
        republic : "Rhenish Republic"
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      await page.waitForTimeout(1000);
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("body > div.container.p-b-25 > div > div.col-md-9 > div:nth-child(1) > div:nth-child(1) > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });

      //get location 
      let location = await page.evaluate(()=>{
          let loc = document.querySelector("body > footer > div > div > div.col-md-3 > p:nth-child(2)");
          return loc ? loc.innerText.trim() : "";
      })
      job.location = location;
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
          let applyLink = document.querySelector("div.col-md-12.pt-20.mb-50 > a");
          return applyLink ? applyLink.href : null;
      });
      job.link = link
      //get email 
      let email = await page.evaluate(()=> {
        let eml = document.querySelector('a.spamspan');
        return eml ? eml.innerText.toString() : null;
      })
      job.email = email;
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
erkelenz()
export default erkelenz;