import puppeteer from "puppeteer";

const kalkon = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let link = ["https://eko.de/unternehmen/stellenangebote.html"]

        let counter = 0;
        do {
            await page.goto(link[counter], { timeout: 0 })
            await page.click('.vbcn-button.js-analytics-track');
            // await page.waitForTimeout(3000);
            // await page.waitForSelector('.job-title')
            await scroll(page);



            //getting all the jobs links 
            const jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll('.listitemtitle a')
                ).map(el => el.href)
            });
            console.log(jobs);
            allJobs.push(...jobs);
            counter++;
        } while (counter < link);

        const allJobDetails = []

        for (const url of allJobs) {
            await page.goto(url)
            await page.click('.vbcn-button.js-analytics-track');
            await scroll(page)
            /// getting all the title

            const title = await page.evaluate(() => {
                let text = document.querySelector('.jobmodul h1')
                return text ? text.innerText : null;
            })

            /// getting all the cell no.
            const cell = await page.evaluate(() => {
                let text = document.querySelector('.jobmodul');
                return text ? text.innerText.match(/\d+[/] \d+ \d+|\d+ \d+[-]\d+|\d+.\d+ - \d+/) : null;
            });

            // getting all the location from the links 
            const location = await page.evaluate(() => {
                let text = document.querySelector('body');
                return text ? text.innerText.match(/[a-zA-Z]+. \d+ [|] \d+ [a-zA-Z,]+ [a-zA-Z]+|[a-zA-Z]+. \d+ [|] \d+ [a-zA-Z.]+|[a-zA-Z.]+ .[a-zA-Z.]+. [a-zA-Z.]+ .[a-zA-Z.]+. [a-zA-Z.]+/) : null;
            });

            /// getting all the emails 
            const email = await page.evaluate(() => {
                let text = document.querySelector('body');
                return text ? text.innerText.match(/[a-zA-Z.]+ [(][a-zA-Z.]+[)] [a-zA-Z.]+ [(][a-zA-Z.]+[)] [a-zA-Z]+/) : null;
            });

            // getting all the applylinks
            const applyLink = await page.evaluate(() => {
                let text = document.querySelector('.applylink a');
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

kalkon();