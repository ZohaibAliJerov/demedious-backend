import puppeteer from "puppeteer";
let positions = [
    "arzt",
     "pflege"
    ];
let levels = [
    "Facharzt", 
    "Chefarzt", 
   "Assistenzarzt",
    "Arzt", 
    "Oberarzt"
 ];
const deutsche_rentenversicherung = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    await page.goto(
      "https://salzetal.deutsche-rentenversicherung-reha-zentren.de/subsites/Salzetal/de/Navigation/04_Service/Stellenangebote/Stellenangebote_node.html"
    );
    page.setDefaultNavigationTimeout(0);
    const jobLinks = [];
    let allUrls = [
      "https://salzetal.deutsche-rentenversicherung-reha-zentren.de/subsites/Salzetal/de/Navigation/04_Service/Stellenangebote/Stellenangebote_node.html"
    ];
    // get all jobs links
    for (let a = 0; a < allUrls.length; a++) {
      await page.goto(allUrls[a]);
      scroll(page);
      let jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".odd > a")).map(
          el => el.href
        );
      });
      jobLinks.push(...jobs);
    }
    await page.waitForTimeout(3000);
    console.log(jobLinks);
    let jobDetails = [];
    for (let jobs of jobLinks) {
      let details = {
        title: "",
        location: " Hemer",
        hospital: "Lungenklinik Hemer",
        link: "",
        level: "",
        position: "",
      };
      scroll(page);
      await page.goto(jobs);

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
      let position = text.match(/arzt|pflege/);
      details.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt" ||
        level == "Arzt" ||
        level == "Oberarzt"
      ) {
        details.position = "artz";
      }
      if (position == "pflege" || (position == "Pflege" && !level in levels)) {
        details.position = "pflege";
        details.level = "Nicht angegeben";
      }

      if (!position in positions) {
        continue;
      }

      //get link   
    let link = await page.evaluate(() => {
        return document.body.innerText.match(/[A_Za-z0-9-._+/]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
    });
    if (typeof link == "object") {
        details.link = {...link};
      }
      let title = await page.evaluate(() => {
        let jbTitle = document.querySelector(".large-34.small-72.columns > h1");
        return jbTitle ? jbTitle.innerText : null;
      });
      details.title = title;

      jobDetails.push(details);
    }
    await page.waitForTimeout(4000);
    console.log(jobDetails);
    await browser.close();
    // await page.close();
    return jobDetails.filter((job) => job.position != "");
  } catch (err) {
    console.error(err);
  }
};

export async function scroll(page) {
    await page.evaluate(() => {
        const distance = 100;
        const delay = 100;
        const timer = setInterval(() => {
            document.scrollingElement.scrollBy(0, distance);
            if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
                clearInterval(timer);
            }
        }, delay);
    });
}
deutsche_rentenversicherung()
