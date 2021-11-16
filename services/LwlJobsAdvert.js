import puppeteer from 'puppeteer'

const lwlJobsAdvert = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let allLinks = [
            'https://www.lwl-klinik-guetersloh.de/de/service/stellenanzeigen/'
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
            //get all job links
            let jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll(".article-text > ul > li a")
                ).map((el) => el.href);
            });
            console.log(jobs)
            allJobs.push(...jobs);
            counter++;
            await page.waitForTimeout(3000);
        } while (counter < allLinks);



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
            // const address = await page.evaluate(() => {
            //     let adr = document.querySelector('.adressData');
            //     return adr.innerText.slice(0, 95);
            // });



            /// get all the email
            const email = await page.evaluate(() => {
                let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/
                let text = Array.from(document.querySelectorAll('.item > span'))
                text = text.map(el => el.innerText);
                let str = text.join(" ")
                str = str.match(regex);
                return str;
            });

            // get all the contact NO.
            const cell = await page.evaluate(() => {
                let regex = /\d{5}[/]\d+ \d+|\d{5} [/] \d+[ -|/]\d+|\d+ \d+-\d+|\d{5}[/]\d+-\d+/;
                let text = Array.from(document.querySelectorAll('.item'))
                text = text.map(el => el.innerText);
                let str = text.join(" ")
                str = str.match(regex);
                return str;
            });

            //getting all the applyLinks
            const applyLink = await page.evaluate(() => {
                return document.querySelector('.applyBtn.apply a').href || null;
            })


            let jobDetails = {
                title,
                // address,
                email,
                cell,
                applyLink
            }
            allJobsDetails.push(jobDetails);
        }
        await page.waitForTimeout(3000);

        console.log(allJobsDetails);
        await browser.close();
        return allJobsDetails


    } catch (error) {
        console.log(error)
    }
}
lwlJobsAdvert();