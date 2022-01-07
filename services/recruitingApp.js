import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let karrier_evk_dus = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://recruitingapp-5039.de.umantis.com/Jobs/31", {
      waitUntil: "load",
      timeout: 0,
    });

 
    let nextPage = true;
    let allJobLinks = [];

    //get all jobLinks
    while (nextPage) {
        //       //scroll the page
            await scroll(page)
              //get all jobLinks
              let jobLinks = await page.evaluate(() => {
                return Array.from(
                  document.querySelectorAll("span.tableaslist_subtitle.tableaslist_element_3473 a")
                ).map((el) => el.href);
              });
              allJobLinks.push(...jobLinks);
              await page.waitForTimeout(3000);
              let bottomNextLink = await page.evaluate(() => {
                return document.querySelector("a#tablenav_bottom_nextlink_66856");
              });
              if (bottomNextLink) {
                await page.click("a#tablenav_bottom_nextlink_66856");
                nextPage = true;
              } else {
                nextPage = false;
              }
            }
    console.log(allJobLinks);
    let allJobs = [];

    for (let jobLink of allJobLinks) {
      let job = {
        title: "",
        location: "Düsseldorf",
        hospital: "Evangelisches Krankenhaus Düsseldorf",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await scroll(page)
      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".inner.linearize-level-1 > hgroup h2");
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
      let link = await page.evaluate(() => {
        let appLink = document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/)
        return appLink
      });
      
      job.link = link
      allJobs.push(job);
    }
    console.log(allJobs)
    await page.close();
    await browser.close();
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

karrier_evk_dus();
