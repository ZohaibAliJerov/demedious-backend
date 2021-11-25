import puppeteer from 'puppeteer';

const drefialt_hospital = async () => {
    try {

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);


        let allJobs = []
        let link = ['https://dreifaltigkeits-hospital.de/ausbildung-karriere/aerztlicher-dienst/aktuelle-stellenangebote/'];

        let counter = 0;

        do {
            await page.goto(link[counter], { timeout: 0 });
            scroll(page);

            // getting all the links

            const jobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.jobs-listitem > .jobs-link a')
                ).map(el => el.href)
            })
            console.log(jobs);
            allJobs.push(...jobs);
            counter++;
        } while (counter < link);

        const allJobDetails = [];

        for (const urls of allJobs) {
            await page.goto(urls);
            scroll(page);

            //getting all the title.

            await page.waitForSelector('.news-text-wrap > p > span.big');
            const title = await page.evaluate(() => {
                return document.querySelector('.news-text-wrap > p > span.big').innerText || null;
            });

            /// getting all the location 

            const location = await page.evaluate(() => {
                let regex = /[a-zA-Z0-9]+ [a-zA-Z0-9]+[\n][a-zA-Z0-9]+.[a-zA-Z0-9]+ \d+[\n][a-zA-Z0-9]+ [a-zA-Z0-9]+/
                let text = document.querySelector('.news-text-wrap')
                return text ? text.innerText.match(regex) : null;

            });

            /// getting all the cell no 

            const cell = await page.evaluate(() => {
                let regex = /[(]\d+ \d+ \d+[)] \d+ - \d+/
                let text = document.querySelector(".container > div.row > div.col-md-9.content-area p");
                return text ? text.innerText.match(regex) : null;
            });

            // getting all the emails 
            const email = await page.evaluate(() => {

                let text = document.querySelector(".news-text-wrap > p > a");
                return text ? text.href : null;
            });


            const jobDetails = {
                title,
                location,
                cell,
                email,

            }
            allJobDetails.push(jobDetails);
            await page.waitForTimeout(3000);
        }
        console.log(allJobDetails);
        await page.close();
        await browser.close();
        return allJobDetails
    } catch (error) {
        console.log(error)
    }
}


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

drefialt_hospital()