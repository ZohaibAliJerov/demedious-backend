import puppeteer from 'puppeteer';

const stJosefPar = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let allLinks = [
            'https://www.bk-paderborn.de/bkp/bildung-karriere/stellenboerse/?berufsgruppe=&pageId29534281=1#list_29534281',
            'https://www.bk-paderborn.de/bkp/bildung-karriere/stellenboerse/?berufsgruppe=&pageId29534281=2#list_29534281',
            'https://www.bk-paderborn.de/bkp/bildung-karriere/stellenboerse/?berufsgruppe=&pageId29534281=3#list_29534281',
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
                    document.querySelectorAll('.listEntryRelative > h2 a')
                ).map((el) => el.href)
            });
            allJobs.push(...jobs)

            counter++;
            await page.waitForTimeout(3000);
        } while (counter < allLinks.length);
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
            const applyLink = await page.evaluate(() => {
                let applink = document.querySelector('.col.col1 > div > a');
                return applink ? applink.href : null;
            });

            /// get all the address 
            const address = await page.evaluate(() => {
                let adr = document.querySelector('.col.col2');
                return adr ? adr.innerText.match(/[a-zA-z]+ [A-Za-z]+. \d+[\n]\d+ [a-zA-Z]+|H[a-zA-z]+ [A-Za-z]+. \d+, \d+ [a-zA-Z]+/) : null;
            });
            // getting all the emails;  
            const email = await page.evaluate(() => {
                // let regex = /(\w+)(\.[a-z]+)@([a-z]+)?\.[a-z]{2,3}|(\w+)(-[a-z]+)@([a-z]+)?\.[a-z]{2,3}|(\w+)([a-z]+)@([a-z]+)?\.[a-z]{2,3}|([a-z]+)(-[a-z]+)(\.[a-z]+)@([a-z]+)(\.[a-z]{2})|(\w+)@([a-z]+)(-[a-z]+)(\.[a-z]{2})|([\.)([)@([a-z]+)(-[a-z]+)(\.[a-z]{2})|(\w+)(-[a-z]{3}) (\[[a-z]{2})(]) ([a-z]{4}\.[a-z]{2})/
                let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
                let text = Array.from(document.querySelectorAll('.elementStandard.elementContent.elementText > p'))
                text = text.map(el => el.innerText);
                let str = text.join(" ");
                return str.match(regex);

            });
            // // getting all the cell no. 
            const cell = await page.evaluate(() => {
                let regex = /\d+ [/] \d{3}-\d+|\d+ \d{3}-\d{4}|\d{5} \d{3} \d{4}|[(]\d+[)] \d+ \d+|\d{5}[/]\d{7}|\d{5}[/]\d{5} \d{4}|\d{5} \d{5}/;
                let text = Array.from(document.querySelectorAll('.col.col1 p'));
                text = text.map(el => el.innerText)
                let str = text.join(" ");
                str = str.match(regex);
                return str;

            });

            let jobDetails = {
                title,
                applyLink,
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

stJosefPar();