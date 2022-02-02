

import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let ddz = async () => {
    try {
        let browser = await puppeteer.launch({
            headless: true,
        });

        let page = await browser.newPage();

        let nextPage = true;
        let allJobLinks = []
        await page.goto("https://bildung.alexianer.de/LC/6/2046671275/OBS/UebersichtStandard", {
            waitUntil: "load",
            timeout: 0,
        });
        // await page.waitForTimeout(3000);
        //wait for a while
        while (nextPage) {

            await scroll(page)
            //get all jobLinks
            // await page.waitForSelector('a.openItem.jsDatatableOeffneZeile')
            let jobLinks = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll("a.openItem.jsDatatableOeffneZeile")
                ).map((el) => el.href);
            });
            let bottomNextLink = await page.evaluate(() => {
                return document.querySelector("#esDatentabelle_next > a");
            });
            if (bottomNextLink) {
                await page.click("#esDatentabelle_next > a");
                nextPage = true;
            } else {
                nextPage = false;
            }
            allJobLinks.push(...jobLinks)
            console.log(allJobLinks);
        }
     

        let allJobs = [];

        for (let jobLink of allJobLinks) {
            let job = {
                title: "",
                location: "",
                hospital: "Alexianer Krankenhaus Aachen",
                link: "",
                level: "",
                position: "",
                city: "Aachen",
                email: "",
                republic: "North Rhine-Westphalia",
            };

            await page.goto(jobLink, {
                waitUntil: "load",
                timeout: 0,
            });

            await page.waitForTimeout(1000);
            //   let tit = 0;
            //   if(tit){
            let title = await page.evaluate(() => {
                let ttitle = document.querySelector(".obsInformation__innerWrapper > h1");
                return ttitle ? ttitle.innerText : "";
            });
            job.title = title;


            job.location = await page.evaluate(() => {
                let loc = document.querySelector('span.obsInformation__stelleOrt ').innerText
                return loc

            });

            if (typeof job.location == 'object' && job.location != null) {
                job.location = job.location[0]
            }
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

            //get link\

            job.email = await page.evaluate(() => {
                return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) || " I.Hauth@alexianer.de"
            });
            if (typeof job.email == "object" && job.email != null) {
                job.email = job.email[0]
            }
            // job.email = email

            // get link 
            let link1 = 0;
            if (link1) {
                const link = await page.evaluate(() => {
                    let applyLink = document.querySelector('a.btn.btn--akzent1.btn-lg.btn-block')
                    return applyLink ? applyLink.href : ""
                })
                job.link = link;
            } else {
                job.link = jobLink
            }
            allJobs.push(job);
        }
        console.log(allJobs)
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
// ddz()
export default ddz


