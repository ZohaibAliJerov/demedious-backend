import puppeteer from "puppeteer"

const lwl = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        //scroll the page
        let allJobs = [];
        let links = [
            'https://www.lwl-therapiezentrum-marsberg.de/de/job-karriere/'
        ];

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


        let counter = 0;
        do {
            await page.goto(links[counter], { timeout: 0 });
            scroll(page);
            //get all job links
            let jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll(".article-text > p > font a")
                ).map((el) => el.href);
            });
            console.log(jobs)
            allJobs.push(...jobs);
            counter++;
            await page.waitForTimeout(3000);
        } while (counter < links);

        const allJobsDetails = [];

        for (const urls of allJobs) {
            await page.goto(urls);
            scroll(page);

            // getting the titles 
            await page.waitForSelector('.text > h1');
            const title = await page.evaluate(() => {
                return document.querySelector('.text > h1').innerText || null
            });

            /// get all the address 
            const address = await page.evaluate(() => {
                // let regex = 
                let text = document.querySelector('p.adressData');
                return text ? text.innerText.match(/[a-zA-z]ü[A-Za-z]+..\d+[\n]\d+.[A-Za-z]+/) : null;

            });

            /// get all the email
            const email = await page.evaluate(() => {
                let Email = document.querySelector('.adressData > a')
                return Email ? Email.innerText : null;

            });

            // get all the contact NO.
            const cell = await page.evaluate(() => {
                let regex = /\d+.[/].\d+[-|/]\d+/;
                let text = document.querySelector('#tab1 > p.adressData');
                return text ? text.innerText.match(regex) : null;
            });

            const applyLink = await page.evaluate(() => {
                let applink = document.querySelector('p.applyBtn.apply a');
                return applink ? applink.href : null;
            })
            const jobDetails = {
                title,
                address,
                email,
                cell,
                applyLink

            }
            allJobsDetails.push(jobDetails)
        }
        await page.waitForTimeout(3000);

        console.log(allJobsDetails);
        await browser.close();
        return allJobsDetails;

    } catch (error) {
        console.log(error)
    }
}
lwl();


