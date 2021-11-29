import puppeteer from "puppeteer";

const eduardus_De = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let link = ["https://eduardus.de/mitarbeit-karriere/fuer-bewerber/stellenmarkt/"]

        let counter = 0;
        do {
            await page.goto(link[counter], { timeout: 0 })
            scroll(page);
            await page.click('body > main > div.container-fluid.sortable > div > div.col-02-exclude > div > div.job-list.teaserbox > button')
            //getting all the jobs links 


            await page.waitForTimeout(3000)
            const jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll('tbody a')
                ).map(el => el.href)
            });
            console.log(jobs);
            allJobs.push(...jobs);
            counter++;
        } while (counter < link.length);

        const allJobDetails = []

        for (const url of allJobs) {
            await page.goto(url)
            await scroll(page)
            /// getting all the title
            await page.waitForSelector('h1')
            const title = await page.evaluate(() => {
                return document.querySelector('h1').innerText || null;
            })

            /// getting all the cell no.
            const cell = await page.evaluate(() => {
                let text = document.querySelector('.story.increase');
                return text ? text.innerText.match(/\d+[/] \d+[ -]\d+|[(]\d+[)][/ ]\d+[ -]\d+|\d+[/ ]\d+.[- ]\d+.\d+/) : null;
            });

            // getting all the location from the links 
            const location = await page.evaluate(() => {
                let text = document.querySelector('.story.increase');
                return text ? text.innerText.match(/[a-zaA-Z]+ [a-zA-Z]+|[a-zA-Z. ]+\d+-\d+[\n]\d+ [a-zA-Z]+/) : null;
            });

            /// getting all the emails 
            const email = await page.evaluate(() => {
                let text = document.querySelector('.story.increase');
                return text ? text.innerText.match(/[a-zaA-Z-]+@[a-zA-Z.]+/) : null;
            });

            const applyLink = await page.evaluate(() => {
                let text = document.querySelector('.cr.button a')
                return text ? text.href : null;
            })

            const jobDetails = {
                title,
                cell,
                location,
                email,
                applyLink
            };
            allJobDetails.push(jobDetails);
            await page.waitForTimeout(3000);
        }
        console.log(allJobDetails);
        await page.close();
        await browser.close();
        return allJobDetails;
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
};

eduardus_De();