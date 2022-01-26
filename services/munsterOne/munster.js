import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
let munster = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();
    await page.goto("https://www.hjk-muenster.de/karriere/stellenmarkt.html", {
      waitUntil: "load",
      timeout: 0,
    });
    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("h3.media-heading.hidden-xs > a")
      ).map((el) => el.href);
    });
    console.log(jobLinks)
    let allJobs = [];
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        city : "Münster",
        hospital: "Herz-Jesu-Krankenhaus Münster-Hiltrup",
        link: "",
        email: "",
        level: "",
        position: "",
        republic : "Irish republicans"
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      await page.waitForTimeout(1000);
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h2.news-heading");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });

      //get location 
      let location = await page.evaluate(()=>{
          let loc = document.querySelector("#c51415 > p:nth-child(2)");
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
    //   let link = await page.evaluate(() => {
    //       let applyLink = document.querySelector("#c51741 > div.big-demo.go-wide.news > div.grid > div:nth-child(1) > div.media > div > h3 > a");
    //       return applyLink ? applyLink.href : "";
    //   });
      job.link = jobLink
      //get email 
      let email = await page.evaluate(()=> {
        let eml = document.querySelector('div.article');
        return eml ? eml.innerText.match(/\w+\@\w+\-\w+.\w+/).toString() : null;
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
munster()
export default munster;