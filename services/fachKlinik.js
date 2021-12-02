import puppeteer from "puppeteer";

const fachKlinik_h = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let link = ["https://fachklinik-hornheide.de/karriere/stellenmarkt/index_ger.html"]

        let counter = 0;
        do {
            await page.goto(link[counter], { timeout: 0 })
            scroll(page);

            //getting all the jobs links 

            await page.waitForSelector('#jotable a')
            await page.waitForTimeout(3000)
            const jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll('#jotable a')
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
            await page.waitForSelector('h2')
            const title = await page.evaluate(() => {
                return document.querySelector('h2').innerText || null;
            })

            /// getting all the cell no.
            const cell = await page.evaluate(() => {
                let text = document.querySelector('#jo');
                return text ? text.innerText.match(/\d+\s\d+-\d+|\d+ [/|-] \d+ \d+/) : null;
            });

            // getting all the location from the links 
            const location = await page.evaluate(() => {
                let text = document.querySelector('#jo');
                return text ? text.innerText.match(/[a-zaA-Z]+.[a-zaA-Z]+ \d+[\n]\d+ [a-zaA-Z]+.[a-zA-Z]+/) : null;
            });

            /// getting all the emails 
            const email = await page.evaluate(() => {
                let text = document.querySelector('#jo');
                return text ? text.innerText.match(/[a-zaA-Z-]+[a-zaA-Z]+.[a-zA-Z]+ [(][a-zA-Z]+[)] [a-zaA-Z]+.[a-zA-Z]+.[a-zA-Z]+/) : null;
            });

            const applyLink = await page.evaluate(() => {
                let text = document.querySelector('.btn.btn-primary')
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

fachKlinik_h();