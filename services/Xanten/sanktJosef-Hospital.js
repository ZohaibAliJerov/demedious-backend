import puppeteer from "puppeteer";

const SanktJosefHospital_Xanten = async () => {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(
            "https://www.sankt-josef-hospital.de/karriere/stellenmarkt/stellenangebote/"
            );
        page.setDefaultNavigationTimeout(0);

        const jobLinks = [];
        let allUrls = [
            "https://www.sankt-josef-hospital.de/karriere/stellenmarkt/stellenangebote/"
            ];
        for (let a = 0; a < allUrls.length; a++) {
            await page.goto(allUrls[a]);
            scroll(page);
            let jobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.vc_btn3-container.vc_btn3-inline > a')
                ).map((el) => el.href);
            });
            jobLinks.push(... jobs);
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);

        let jobDetails = [];
        for (let jobs of jobLinks) {
            let job =  {
                title: "",
                location: "Xanten",
                hospital: "Sankt Josef-Hospital Xanten",
                link: "",
                level: "",
                position: "",
              };
            scroll(page);
            await page.goto(jobs);
            let title = await page.evaluate(() => {
                let jbTitle = document.querySelector('h1.post_title')
                return jbTitle ? 
                jbTitle.innerText : null;
            });
            job.title = title;
            let text = await page.evaluate(() => {
                return document.body.innerText;
              });
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

              let link = await page.evaluate(() => {
                return document.body.innerText.match(/[A_Za-z0-9._+/-]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
              });
              if (typeof link == "object") {
                job.link = link[0];
              }
            jobDetails.push(job);
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
let positions = ["arzt", "pflege"];
let levels = [ "Facharzt",  "Chefarzt", "Assistenzarzt", "Arzt",  "Oberarzt" ];

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


export default SanktJosefHospital_Xanten;