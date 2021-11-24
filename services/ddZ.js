import puppeteer from "puppeteer";

const DDZ = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let allLinks = [
            "https://ddz.de/karriere/#vacancies=tab_172_job/1",
            "https://ddz.de/karriere/#vacancies=tab_172_job/2"
        ]

        let counter = 0;
        do {
            await page.goto(allLinks[counter], { timeout: 0 });
            scroll(page);

            // getting all the links from the website 
            await page.waitForSelector('div > ul.items-container.a-no-color > li.item a');
            let jobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('div > ul.items-container.a-no-color > li.item a')).map(el => el.href);
            });
            console.log(jobs);
            allJobs.push(...jobs);
            counter++
        } while (counter < allLinks.length);

        const allJobDetails = [];

        for (const urls of allJobs) {
            await page.goto(urls);
            scroll(page)

            //getting al the title from the links s 
            await page.waitForSelector('h1')
            const title = await page.evaluate(() => {
                return document.querySelector('h1').innerText || null;

            });

            const location = await page.evaluate(() => {
                let regex = /[a-zaA-Z']+ [a-zaA-Z]+ \d+[\n]\d+ [a-zaA-Z]+.[a-zaA-Z]+/
                let text = document.querySelector('.container.upper-footer')
                return text ? text.innerText.match(regex) : null;
            });

            const cell = await page.evaluate(() => {
                let regex = /[+]\d+ \d+ \d+-\d+/;
                let text = document.querySelector(".container.upper-footer");
                return text ? text.innerText.match(regex) : null;
            })

            // getting all the emails if avaliable 
            const email = await page.evaluate(() => {
                let regex = /[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+/;
                let text = document.querySelector('.textwidget.custom-html-widget');
                return text ? text.innerText.match(regex) : null;
            })
            const jobDetails = {
                title,
                location,
                email,
                cell
            }
            allJobDetails.push(jobDetails);

        }
        await page.waitForTimeout(3000);
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
}

DDZ()