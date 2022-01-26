import puppeteer from "puppeteer";

const krankenhausMara = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        await page.goto("https://karriere.evkb.de/stellenboerse.html?stadt=1");
        page.setDefaultNavigationTimeout(0);
        const jobLinks = [ ];
        let allUrls = [
            "https://karriere.evkb.de/stellenboerse.html?stadt=1"
        ];
        // get all jobs links
        for (let a = 0; a < allUrls.length; a++) {
            await page.goto(allUrls[a]);
            scroll(page);
            let jobs = await page.evaluate(() => {
                let links =  Array.from(document.querySelectorAll(".job-offer > a")).map(
                    el => el.href
                );
                return links;
            });
            jobLinks.push(...jobs);
        }
        // await page.waitForTimeout(3000);
        console.log(jobLinks);
        const jobsDetails = [];
        for (let hrefs of jobLinks) {
            let job = {
                title: "",
                location: "Bielefeld",
                hospital: "Krankenhaus Mara",
                link: "",
                level: "",
                position: "",
              };
            scroll(page);
            await page.goto(hrefs);
            let title = await page.evaluate(() => {
                let title = document.querySelector('h1')
                return title ? title.innerText : null
            })
            job.title = title
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
            let link = await page.evaluate(() => {
                let apply = document.querySelector('a.kein-mitarbeiter.button.btn.btn-default')
                return apply ? apply.href : null;

            })
            job.link = link;
            jobsDetails.push(job)
        };
            // await page.waitForTimeout(4000)
        console.log(jobsDetails);
        await browser.close();
        // await page.close();
        return jobsDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err);
    }
};
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

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

  krankenhausMara();