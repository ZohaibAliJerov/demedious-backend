/**
 * 
 * import puppeteer from 'puppeteer';

const beraLinaKlinik = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let allLinks = [
            "https://www.berolinaklinik.de/aktuelles/stellenangebote/"
        ]
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
            await page.goto(allLinks[counter], { timeout: 0 });
            scroll(page);

            // get all jobs links 

            let jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll('.news-list-container > ul > li > .news-list-item > h3 a')
                ).map(el => el.href)
            });
            allJobs.push(...jobs)

            counter++;
            await page.waitForTimeout(3000);
        } while (counter < allLinks);
        console.log(allJobs);

        const allJobDetails = [];
        // get all the data from stored links 
        for (const urls of allJobs) {
            await page.goto(urls)
            scroll(page);

            // gettingg all the Title of the links 
            await page.waitForSelector('h1')
            const title = await page.evaluate(() => {
                let Title = document.querySelector('h1');
                return Title ? Title.innerText : null;
            });

            // getting all the address 
            const address = await page.evaluate(() => {
                let regex = /[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+ [&] [a-zA-Z]+. [a-zA-Z]+ [a-zA-Zü]+. \d+.\d+ [a-zA-Zö]+|[a-zA-Züß]+ \d+, \d+ [a-zA-Zö]+/;
                let adr = document.querySelector('.contentboxinner')
                return adr ? adr.innerText.match(regex) : null;

            });
            // getting all the cell no. 
            const cell = await page.evaluate(() => {
                let regex = /\d{1} \d{2} \d{2}[/]\d+ \d{2} - \d+ \d+|\d+ \d+-\d+| \d+ \d+ \d+ [/] \d+ \d+ - \d+ \d+/;
                let text = Array.from(document.querySelectorAll('.contentboxinner'))
                text = text.map(el => el.innerText)
                let str = text.join(" ");
                str = str.match(regex);
                return str;

            });
            // getting email links 
            const email = await page.evaluate(() => {
                let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+|[a-zA-Z0-9]+ @[a-zA-Z0-9-]+\ [a-z]\w+ \.[a-z]+/
                let text = document.querySelector('.contentboxinner');
                return text ? text.innerText.match(regex) : null;
            });
            let jobDetails = {
                title,
                address,
                cell,
                email,



            }
            allJobDetails.push(jobDetails);
        }
        await page.waitForTimeout(3000);
        console.log(allJobDetails);
        await browser.close();
        return allJobDetails
    } catch (error) {
        console.log(error)
    }
}

beraLinaKlinik();
 * first service
 */
