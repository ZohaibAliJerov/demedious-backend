


import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let stifiungTan = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
            let jobLinks = []
            let allLinks = [
              "https://stiftung-tannenhof-karriere.dvinci-easy.com/de/jobs"
            ]
            let counter = 0;
            do {
                await page.goto(allLinks[counter], { timeout: 0 })
                
               await scroll(page)
               
            await page.waitForTimeout(3000)
            await page.click('#headerStartPage > div > dvinci-layout > div > div > div:nth-child(2) > div.col-xs-12.col-sm-7.col-md-8.col-lg-9 > div.dvinci-job-list-pagination > a > span > span')
         
                
                // getting all the links 
                const links = await page.evaluate(() => {
                    return Array.from(
                        document.querySelectorAll('a.dvinci-job-position.ng-binding' )
                        )
                        .map(el => el.href)
                });
                // console.log(links)
                jobLinks.push(...links);
                counter++
            } while (counter > allLinks.length);
            console.log(jobLinks)
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Remscheid",
        hospital: "Evangelische Stiftung Tannenhof - Fachkrankenhaus für Psychiatrie, Psychotherapie, Psychosomatik und",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await scroll(page)

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
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
       let applink = document.querySelector('.btn.btn-primary');
       return applink ? applink.href : null;
    });
      // if (typeof link == "object") {
      //   job.link = link;
      // }
      // console.log(job);
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

stifiungTan()






