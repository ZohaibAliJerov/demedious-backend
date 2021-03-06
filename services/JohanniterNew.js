
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let ddz = async () => {
    try {
        let browser = await puppeteer.launch({
            headless: false,
        });

        let page = await browser.newPage();
        
        // let nextPage = true;
        let allJobLinks = []
        await page.goto("https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/#c44483", {
            waitUntil: "load",
            timeout: 0,
        });

        await scroll(page)
        // await page.waitForTimeout(5000);
        let pagnitionLink = await page.evaluate(() => {
            return Array.from(
                document.querySelectorAll(".c-pagination__item.c-pagination__item--page a")
            ).map((el) => el.href);
        }); 

        console.log(pagnitionLink) 
        for (const link1 of pagnitionLink) {
            await page.goto(link1 , {
                waitUntil: "load",
                timeout : 0
            })
            let jobLinks = await page.evaluate(() => {
                        return Array.from(
                            document.querySelectorAll("h3 > a")
                        ).map((el) => el.href);
                    }); 
                allJobLinks.push(...jobLinks)

        }
        //wait for a while
        // while (nextPage) {
        //     // await page.waitForTimeout(1000);
        //     await scroll(page)
        //     //get all jobLinks
        //     let jobLinks = await page.evaluate(() => {
        //         return Array.from(
        //             document.querySelectorAll("h3 > a")
        //         ).map((el) => el.href);
        //     }); 
        //     // let bottomNextLink = await page.evaluate(() => {
        //     //     return document.querySelector(".c-pagination__item.c-pagination__item--page a");
        //     // });
        //     if (bottomNextLink) {
        //         await page.click(".c-pagination__item c-pagination__item--page a");
        //         nextPage = true;
        //     } else {
        //         nextPage = false;
        //     }
        //     allJobLinks.push(...jobLinks)
        // }
        console.log(allJobLinks);

        let allJobs = [];

        for (let jobLink of allJobLinks) {
            let job = {
                title: "",
                location: "",
                hospital: "Johanniter-Klinik am Rombergpark",
                link: "",
                level: "",
                position: "",
                city: "Dortmund",
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
                let ttitle = document.querySelector(".c-page-title > h1");
                return ttitle ? ttitle.innerText : "";
            });
            job.title = title;
         

            job.location = await page.evaluate(() => {
                return document.body.innerText.match(/[a-zA-Z-.??].+ \d+[\n]\d+ [a-zA-Z-.??]+|[a-zA-Z-.??].+ \d+[\n][\n]\d+ [a-zA-Z-.??]+/) || " info(at)do.johanniter-kliniken.de"

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
                return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) || " info(at)do.johanniter-kliniken.de"
            });
            if (typeof job.email == "object" && job.email != null) {
                job.email = job.email[0]
            }
            // job.email = email

            // get link 
            let link1 = 0;
            if (link1) {
              const link = await page.evaluate(() => {
                let applyLink = document.querySelector('a.c-button.c-button--main.c-button--large')
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
ddz()
// export default ddz
