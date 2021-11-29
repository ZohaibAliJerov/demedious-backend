import puppeteer from "puppeteer"

const drkKindrKlinik = async () => {

    try {

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0)



        const allJobs = [];
        let counter = 0;

        do {
            await page.goto('https://www.drk-kinderklinik.de/jobs-und-karriere/stellenmarkt/', { timeout: 0 });
            scroll(page);

            await page.waitForSelector('h3')
            const title = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('h3')
                ).map(el => el.innerText);
            });
            allJobs.push(...title);
            console.log(title)
            counter++;
        } while (counter < allJobs);

        const allJobDetails = []

        for (const jobtitle of allJobs) {
            await page.click(jobtitle)
            scroll(page)


            const location = await page.evaluate(() => {
                let regex = /[a-zaA-Z]+[a-zaA-Z]+. \d+[\n]\d+ [a-zaA-Z]+.[a-zA-Z]+/

                let text = Array.from(document.querySelectorAll('.csc-default'));
                text = text.map(el => el.innerText)

                return text = text.filter(el => el.match(regex));

            })


            const jobDetails = {
                location
            };
            allJobDetails.push(jobDetails);
            await page.waitForTimeout(3000)

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

drkKindrKlinik();