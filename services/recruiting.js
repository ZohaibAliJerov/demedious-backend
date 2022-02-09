import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
const recruiting = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    let url = "https://recruitingapp-4181.de.umantis.com/Jobs/1?lang=ger";

    await page.goto(url, {
      waitUntil: "load",
      timeout: 0,
    });
    //wait for a while
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
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".HSTableLinkSubTitle")
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
    } //end of while loop
    let allJobs = [];
    //visit each job link
    for (let jobLink of allJobLinks) {
      for (let jobLink of allJobs) {
        let job = {
          title: "",
          location: "Düsseldorf",
          hospital: "Klinik für Psychiatrie und",
          link: "",
          level: "",
          position: "",
        };
        await page.goto(jobLink, { timeout: 0, waitUntil: "load" });

        await waitForTimeout(1000);
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
        //get title
        job.title = await page.evaluate(() => {
          return document.querySelector("h1").innerText;
        });
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
        if (
          position == "pflege" ||
          (position == "Pflege" && !level in levels)
        ) {
          job.position = "pflege";
          job.level = "Nicht angegeben";
        }

        if (!position in positions) {
          continue;
        }

        //get applyLink
        job.link = await page.evaluate(() => {
          return document.querySelector("a.button.apply-link").href;
        });
        allJobLinks.push(job);
      }
      return allJobs;
    }
  } catch (error) {
    console.log(error);
  }
};

//export default recruiting;
(async () => {
  let res = await recruiting();
  console.log(res);
})();
