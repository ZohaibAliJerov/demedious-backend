import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let ugos_de = async () => {
    try {
        let browser = await puppeteer.launch({
            headless: true,
        });

        let page = await browser.newPage();

        let url = ["https://www.gelderlandklinik.de/arbeit-karriere/stellenangebote-auf-dem-gesundheitscampus-geldern?tx_dg_stellenboerse_stellen%5Baction%5D=test&tx_dg_stellenboerse_stellen%5Bcontroller%5D=test&cHash=bbe5950cd222c16a790c630379b2054d"]


        let nextPage = true;
        let allJobLinks = []
        let counter = 0
        do {
            await page.goto(url[counter], {
                waitUntil: "load",
                timeout: 0,
            });
            //wait for a while
            await page.waitForTimeout(1000);
            await scroll(page)
            //get all jobLinks
            let jobLinks = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll(".stelle a")
                ).map((el) => el.href);
            });
            let bottomNextLink = await page.evaluate(() => {
                return document.querySelector("#paginate > div > a.next_link");
            });
            if (bottomNextLink) {
                await page.click("#paginate > div > a.next_link");
                nextPage = true;
            } else {
                nextPage = false;
            }
            allJobLinks.push(...jobLinks)
            counter++;

        } while (counter < url);
        console.log(allJobLinks);

        let allJobs = [];

        for (let jobLink of allJobLinks) {
            let job = {
                title: "",
                location: "",
                hospital: "Gelderland-Klinik Geldern",
                link: "",
                level: "",
                position: "",
                city: "Geldern",
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
                let ttitle = document.querySelector("h1");
                return ttitle ? ttitle.innerText : "";
            });
            job.title = title;

            job.location = await page.evaluate(() => {
                return document.body.innerText.match(/[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/) || ""
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
                return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/);
            });
            if (typeof job.email == "object" && job.email != null) {
                job.email = job.email[0]
            }
          

            // get link 
            let link1 = 0;
            if (link1) {
                const link = await page.evaluate(() => {
                    let applyLink = document.querySelector('a.btn.online-formular.pull-right')
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
// ugos_de()
export default ugos_de

