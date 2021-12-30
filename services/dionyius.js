import puppeteer from "puppeteer";

const kalkon = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = ["https://www.dionysius-walsum.de/fachklinik-st-camillus/"];

     
        const allJobDetails = []

        for (const url of allJobs) {
            await page.goto(url)
            
            await scroll(page)
            /// getting all the title

            const title = await page.evaluate(() => {
                let text = document.querySelector('h1')
                return text ? text.innerText : null;
            })

            /// getting all the cell no.
            const cell = await page.evaluate(() => {
                let text = document.querySelector('body');
                return text ? text.innerText.match(/\d+ . \d+ \d+ \d+/) : null;
            });

            // getting all the location from the links 
            const location = await page.evaluate(() => {
                let text = document.querySelector('body');
                return text ? text.innerText.match(/[a-zA-Z. ]+\d+[\n]\d+ [a-zA-Z. ,]+/) : null;
            });

            /// getting all the emails 
            const email = await page.evaluate(() => {
                let text = document.querySelector('body');
                return text ? text.innerText.match(/[a-zA-Z. ]+@[a-zA-Z-.]+/) : null;
            });

            // getting all the applylinks
            const applyLink = await page.evaluate(() => {
                let text = document.querySelector('#et-boc > div > div > div > div > div > div > div > p:nth-child(7) > a:nth-child(1)');
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