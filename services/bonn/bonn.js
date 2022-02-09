import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];

let bonn = async () => {
    try {
        let browser = await puppeteer.launch({
            headless: false,
        });
        let page = await browser.newPage();

        await page.goto(
            "https://www.johanniter.de/johanniter-kliniken/johanniter-kliniken-bonn/karriere/",
            "https://www.johanniter.de/johanniter-kliniken/johanniter-kliniken-bonn/karriere/?page=2&cHash=2b4241df6395a4e3a7d722657653dbe9",
            "https://www.johanniter.de/johanniter-kliniken/johanniter-kliniken-bonn/karriere/?page=3&cHash=1f1d05b31372b33a806761256e82f057", {
                waitUntil: "load",
                timeout: 0,
            });

        await scroll(page);

        //get all jobLinks
        const jobLinks = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("div.c-content-list__text > h3 > a")).map(
                (el) => el.href
            );
        });

        console.log(jobLinks);
        let allJobs = [];

        for (let jobLink of jobLinks) {
            let job = {
                title: "",
                location: "Bonn",
                hospital: "Johanniter Krankenhaus Bonn",
                link: "",
                level: "",
                position: "",
            };

            await page.goto(jobLink, {
                waitUntil: "load",
                timeout: 0,
            });

            await page.waitForTimeout(1000);

            let title = await page.evaluate(() => {
                let ttitle = document.querySelector("h1");
                return ttitle ? ttitle.innerText : "";
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
                level == "Assistenzarzt"||
                level =="Arzt"||
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
                let lnk = document.querySelector(".c-button.c-button--main.c-button--large");
                return lnk ? lnk.href : "";
            });
            job.link = link;
            allJobs.push(job);
        }
        console.log(allJobs);
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
bonn();
export default bonn;