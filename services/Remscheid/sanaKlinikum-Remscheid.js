import puppeteer from "puppeteer";

const klinikumRemscheid = async () => {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        // await page.goto(
        //     "https://www.sana.de/remscheid/karriere/stellenangebote/#c63039"
        //     );
        page.setDefaultNavigationTimeout(0);

        const jobLinks = [];
        let allUrls = [
       "https://www.sana.de/remscheid/karriere/stellenangebote/&nbsp;"
        ];

        // all jobsLinks;
        for (let a = 0; a < allUrls; a++) {
            await page.goto(allUrls[a]);
            scroll(page);
            let jobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('#container_2315 > a')
                )
                .map(
                    (el) => el.href);
            });
            jobLinks.push(...jobs);
        }
        await page.waitForTimeout(3000)
        console.log(jobLinks);

        let jobDetails = [];
        for (let jobs of jobLinks) {
            let details = {
                title: "",
                location: "Radevormwald",
                hospital: "Sana Krankenhaus Radevormwald",
                link: "",
                level: "",
                position: "",
            };
            scroll(page);
            await page.goto(jobs);
            let title = await page.evaluate(() => {
                let jbTitle = document.querySelector('.section-title.section-title--size-1.t-col-2 > h1')
                return jbTitle ? 
                jbTitle.innerText : null;
            });
            details.title = title;
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
                level == "Assistenzarzt"
              ) {
                details.position = "artz";
              }
              if (position == "pflege" || (position == "Pflege" && !level in levels)) {
                details.position = "pflege";
                details.level = "Nicht angegeben";
              };
        
              if (!position in positions) {
                continue;
              };
        
              let link = await page.evaluate(() => {
                return document.body.innerText.match(/[a-zA-Z0-9+-/-]+.[a-zA-Z._-]+.@.[a-zA-Z0-9-]+\.[a-zA-Z0-9-_]+/g);
              });
              if (typeof link == "object") {
                details.link = link;
              }
          await page.waitForTimeout(4000)
            jobDetails.push(details);
        }
        console.log(jobDetails);

        await browser.close();
        // await page.close();
    return jobDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err);
    }
};

let positions = [
    "arzt",
     "pflege"
    ];
let levels = [
    "Facharzt", 
    "Chefarzt", 
"Assistenzarzt"
 ];
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
};


klinikumRemscheid()
