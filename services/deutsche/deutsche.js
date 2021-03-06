import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let deutsche = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto(
        "https://koenigsfeld.deutsche-rentenversicherung-reha-zentren.de/subsites/Koenigsfeld/de/Navigation/Service/Stellenangebote/Stellenangebote_node.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
      //scroll the page
      await scroll(page);
      await page.waitForTimeout(1000);
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            "#content > div > div > div > table > tbody > tr > td:nth-child(1) > a"
          )
        ).map((el) => el.href);
      });
    console.log(jobLinks)
    let allJobs = [];
    
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "58256 Ennepetal",
        hospital: "Klinik Konigsfeld",
        city: "Ennepetal",
        link: "",
        level: "",
        email: "",
        position: "",
        republic: "North Rhine-Westphalia",
    };
    await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
    });
    
    await page.waitForTimeout(1000);
    //get title
    let title = await page.evaluate(()=> {
        return Array.from(
            document.querySelectorAll('h1.isFirstInSlot')
        ).map(el => el.innerText)
    })
    job.title =  String() + title;
    
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get email
      let email = await page.evaluate(() => {
        return document.body.innerText.match(/\w+\@\w+\-\w+.\w+/) ||"N/A";
      });
      job.email = String() + email;
      //apply link
      job.link = jobLink;
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
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
deutsche()
export default deutsche;
