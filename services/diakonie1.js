import puppeteer from "puppeteer";

const diakonia = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = []
        let allLinks = [
            'https://www.diakonie-sw.de/jobs-karriere/stellenangebote/aerzte/'
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
            await page.goto(allLinks[counter], { timeout: 0 })
            scroll(page)

            // getting all the links 
            const links = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.jobs-list-item-descr.clearfix > h2 a'))
                    .map(el => el.href)
            });
            console.log(links)
            allJobs.push(...links);
            counter++
        } while (counter > allLinks);

        const allJobsDetails = [];
        for (const urls of allJobs) {
            await page.goto(urls);
            scroll(page);

            // getting all the title of links 
            await page.waitForSelector('h1')
            const title = await page.evaluate(() => {
                return document.querySelector('h1').innerText || null
            });

            // get all the address;
            const location = await page.evaluate(() => {
                let regex = /[a-zaA-Z]+ [a-zaA-Z]+. [a-zaA-Zö]+. [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zaA-Z]+ [a-zaA-Z]+. [a-zaA-Zö]+. [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+ [a-zA-Z]+-[a-zA-Z]+, [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+. [a-zA-Z]+ [a-zA-Z]+.[a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [|] [a-zA-Z]+-[a-zA-Z]+ [a-zA-Z]+ [|] [a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+ [a-zA-Z]+ [|] [a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+.[a-zA-Z]+ \d+ [|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+.[a-zA-Z]+ [a-zA-Z]+ [|] [a-zA-Z]+.[a-zA-Z]+ \d+.[|] \d+ [a-zA-Z]+|[a-zA-Z]+.[a-zA-Z]+ \d+.[|] \d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+. [a-zA-Z]+.[a-zA-Z]+ [a-zA-Z]+ [|] [a-zA-Z]+.[a-zA-Z]+ \d+.[|] \d+ [a-zA-Z]+/
                let text = Array.from(document.querySelectorAll('.news-single-item'))
                text = text.map(el => el.innerText)
                let str = text.join(" ");
                return str.match(regex);
            });

            /// getting all the cell no .

            const cell = await page.evaluate(() => {
                let regex = /\d+ \d+ \d+ \d+[-|/]\d+ \d+/;
                let text = document.querySelector('.news-single-item');
                return text ? text.innerText.match(regex) : null;

            });

            /// getting all the emails froms website 
            const email = await page.evaluate(() => {
                let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+|[a-zA-Z0-9]+ @[a-zA-Z0-9-]+\ [a-z]\w+ \.[a-z]+/;
                let text = Array.from(document.querySelectorAll('.news-single-item'))
                text = text.map(el => el.innerText)
                let str = text.join(" ");
                return str.match(regex);

            })
            const jobDetails = {
                title,
                location,
                cell,
                email
            }
            allJobsDetails.push(jobDetails);
        }
        await page.waitForTimeout(3000)
        console.log(allJobsDetails)
        await browser.close();
        return allJobsDetails;
    } catch (error) {
        console.log(error)
    }
}

diakonia();