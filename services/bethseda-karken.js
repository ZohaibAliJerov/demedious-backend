import puppeteer from "puppeteer";

const bethseda_karken = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let link = ["https://www.bethesda-krankenhaus-duisburg.de/karriere/%C3%A4rztlicher-dienst/"]

        let counter = 0;
        do {
            await page.goto(link[counter], { timeout: 0 })
            scroll(page);

            //getting all the jobs links 


            await page.waitForTimeout(3000)

            const jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll('.j-module.n.j-text > ul > li a ')
                ).map(el => el.href)
            });

            console.log(jobs);
            allJobs.push(...jobs);
            counter++;
        } while (counter < link);

        const allJobDetails = []

        for (const url of allJobs) {
            await page.goto(url)
            await scroll(page)
            /// getting all the title
            await page.waitForSelector('h3')
            const title = await page.evaluate(() => {
                let text = document.querySelector('h3')
                return text ? text.innerText : null;
            });

            /// getting all the cell no.
            const cell = await page.evaluate(() => {
                let text = document.querySelector('.j-module.n.j-text');
                return text ? text.innerText.match(/\d+ \d+..\d+|\d+.\d+-\d+|[+]\d+ .\d+. \d+.-.\d+ \d+|[+]\d+ .\d+. \d+ \d+.-.\d+|[+]\d+ .\d+. \d+[-] \d+ - \d+|[+] .\d+. \d+ \d+ -\d+/) : null;
            });

            // getting all the links
            // const applyLink = await page.evaluate(() => {
            //     let link = document.querySelector('a.kein-mitarbeiter.button.btn.btn-default')
            //     return link ? link.href : null;

            // })
            // getting all the location from the links 
            const location = await page.evaluate(() => {
                let text = document.querySelector('.j-module.n.j-text');
                return text ? text.innerText.match(/[a-zA-Z.]+ \d+[\n]\d+ [a-zA-Z]+|[a-zA-Z.]+ \d+, \d+ [a-zA-Z]+/) : null;
            });

            // /// getting all the emails 
            const email = await page.evaluate(() => {
                let text = document.querySelector('.j-module.n.j-text');
                return text ? text.innerText.match(/[a-zA-Z.]+@[a-zA-Z.]+/) : null;
            });


            const jobDetails = {
                title,
                cell,
                // applyLink,
                location,
                email

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

bethseda_karken();