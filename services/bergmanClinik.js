import puppeteer from 'puppeteer';

const bergmanclinics = async () => {
    try {

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);


        let allJobs = []
        let link = ['https://www.bergmanclinics-klinikimpark.de/en/karriere/stellenausschreibungen/'];

        let counter = 0;

        do {
            await page.goto(link[counter], { timeout: 0 });
            scroll(page);

            // getting all the links 

            const job = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.tableaslist_subtitle.tableaslist_element_1152488 a')
                ).map(el => el.href)
            });
            console.log(job);
            // allJobs.push(job);
            counter++;
        } while (counter < link);
        // console.log(allJobs)
        // 
        // const allJobDetails = [];

        // for (const urls of allJobs) {
        //     await page.goto(urls);
        //     scroll(page);

        //     //getting all the title.

        //     await page.waitForSelector('h1');
        //     const title = await page.evaluate(() => {
        //         return document.querySelector('h1').innerText || null;
        //     });

        //     /// getting all the location 

        //     const location = await page.evaluate(() => {
        //         let regex = /[a-zA-Z0-9]+. [a-zA-Z0-9]+ [a-zA-Z0-9]+ [a-zA-Z0-9ö]+[\n][a-zA-Z0-9 ]+ \d+[-|/]\d+ [a-zA-Z0-9 ö]+|[a-zA-Z0-9ß]+[ ]\d+[\n]\d+ [a-zA-Z0-9]+.|[a-zA-Z0-9]+. [a-zA-Z0-9]+ [a-zA-Z0-9]+ [a-zA-Z0-9]+[\n][a-zA-Z0-9 ]+ \d+|[a-zA-Z0-9]+. [a-zA-Z0-9]+ [a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+[\n][a-zA-Z0-9]+|[a-zA-Z0-9]+. [a-zA-Z0-9]+ [a-zA-Z0-9]+ [a-zA-Z0-9]+.[a-zA-Z0-9]+[\n][a-zA-Z0-9]+/
        //         let text = document.querySelector('.mainContent')
        //         return text ? text.innerText.match(regex) : null;

        //     });

        //     /// getting all the cell no 

        //     const cell = await page.evaluate(() => {
        //         let regex = /\d+ \d+-\d+/
        //         let text = document.querySelector(".mainContent");
        //         return text ? text.innerText.match(regex) : null;
        //     });

        //     // getting all the emails 
        //     const email = await page.evaluate(() => {
        //         let regex = /[a-zA-Z]+.[a-zA-Z-]+[a-zA-Z]+@[a-zA-Z]+.[a-zA-Z]+/
        //         let text = document.querySelector(".mainContent");
        //         return text ? text.innerText.match(regex) : null;
        //     });

        /// getting all the applybtn
        // const applyLink = await page.evaluate(() => {
        //     const apply = document.querySelector('#btn_online_application a');
        //     return apply ? apply.href : null;
        // })
        //     const jobDetails = {
        //         title,
        //         location,
        //         cell,
        //         email,
        //         // applyLink
        //     }
        //     allJobDetails.push(jobDetails);
        //     await page.waitForTimeout(3000);
        // }
        // console.log(allJobDetails);
        // await page.close();
        // await browser.close();
        // return allJobDetails
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

bergmanclinics()