import puppeteer from 'puppeteer';

const betaKlinik = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let allLinks = [
            'https://www.betaklinik.de/beta-klinik/stellenangebote/'
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
                    document.querySelectorAll('.vc_custom_heading.vc_custom_1562575030398.vc_gitem-post-data.vc_gitem-post-data-source-post_title > h3 a')
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

            // getting apply links 
            const email = await page.evaluate(() => {
                let applink = document.querySelector('.content > p a')
                return applink ? applink.href : null;
            });

            // /// get all the address 
            const address = await page.evaluate(() => {
                let regex = /[a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+/
                let adr = document.querySelector('.content');
                return adr ? adr.innerText.match(regex) : null;
            });

            // // // getting all the cell no. 
            // const cell = await page.evaluate(() => {
            //     let regex = /\d+ [/] \d{3}-\d+|\d+ \d{3}-\d{4}|\d{5} \d{3} \d{4}|[(]\d+[)] \d+ \d+|\d{5}[/]\d{7}|\d{5}[/]\d{5} \d{4}|\d{5} \d{5}/;
            //     let text = Array.from(document.querySelectorAll('.col.col1 p'));
            //     text = text.map(el => el.innerText)
            //     let str = text.join(" ");
            //     str = str.match(regex);
            //     return str;

            // });

            let jobDetails = {
                title,
                address,
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

betaKlinik();