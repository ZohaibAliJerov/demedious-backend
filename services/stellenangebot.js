import puppeteer from "puppeteer";

const stellBot = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let allLinks = [
            'https://www.stellenangebot.online/'
        ];

        let counter = 0
        do {
            await page.goto(allLinks[counter], { timeout: 0 });
            scroll(page);

            // get all the links

            let jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll(".insideframe > ul > li a")
                ).map(el => el.href)
            });
            console.log(jobs)
            allJobs.push(...jobs);
            counter++
        } while (counter < allLinks);

        const allJobDetails = []

        for (const url of allJobs) {
            await page.goto(url);
            scroll(page);


            //getting all the title 

            const title = await page.evaluate(() => {
                let text = document.querySelectorAll('.entry-content p')
                text = text[2];
                return text ? text.innerText : null;
            });

            //get all the emails -
            const emails = await page.evaluate(() => {
                let regex = /[a-zA-Z]+.[a-zA-z0-9]+@[a-zA-Z0-9]+-[a-zA-Z0-9]+.[a-zA-Z0-9]+/;
                let text = document.querySelector(".entry-content");

                return text ? text.innerText.match(regex) : null;
            })

            //getting all the number

            const cell = await page.evaluate(() => {
                let regex = /[+].\d+ [(]\d+[)] \d+ \d+-\d+/;
                let text = document.querySelector('.entry-content')
                return text ? text.innerText.match(regex) : null;

            });

            const location = await page.evaluate(() => {
                let regex = /[a-zA-Z0-9üöß]+.\d+[\n]\d+ [a-zA-Z0-9]+.[a-zA-Z0-9]+.[a-zA-Z0-9]+/;
                let text = document.querySelector('.entry-content');
                return text ? text.innerText.match(regex) : null;
            })

            let jobDetails = {
                title,
                location,
                emails,
                cell,

            };
            allJobDetails.push(jobDetails);

            await page.waitForTimeout(3000);
        }
        console.log(allJobDetails);
        await page.close();
        await browser.close()
        return allJobDetails

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


stellBot();