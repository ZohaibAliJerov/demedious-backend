
import e from "express";
import puppeteer from "puppeteer";

const TosCarrer = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let allLinks = [
            'https://www.atos-karriere.de/stellenanzeigen/'
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
                    document.querySelectorAll('.av-masonry-container.isotope.av-js-disabled a')
                ).map((el) => el.href)
            });
            allJobs.push(...jobs)

            counter++;
            await page.waitForTimeout(3000);
        } while (counter < allLinks);
        console.log(allJobs);

        let allJobDetails = []
        // get all the data from stored links 
        for (const urls of allJobs) {
            await page.goto(urls)
            scroll(page);

            // gettingg all the Title of the links 
            await page.waitForSelector('h1')
            const title = await page.evaluate(() => {
                return document.querySelector('h1').innerText || null
            });

            // getting all the emails;  
            const email = await page.evaluate(() => {
                let regex = /(\w+)(\.[a-z]+)@([a-z]+)?\.[a-z]{2,3}|(\w+)(-[a-z]+)@([a-z]+)?\.[a-z]{2,3}|(\w+)([a-z]+)@([a-z]+)?\.[a-z]{2,3}|([a-z]+)(-[a-z]+)(\.[a-z]+)@([a-z]+)(\.[a-z]{2})|(\w+)@([a-z]+)(-[a-z]+)(\.[a-z]{2})|([\.)([)@([a-z]+)(-[a-z]+)(\.[a-z]{2})|(\w+)(-[a-z]{3}) (\[[a-z]{2})(]) ([a-z]{4}\.[a-z]{2})/
                let text = Array.from(document.querySelectorAll('.avia_textblock > p')).map(el => el.innerText);

                return text.filter(el => el.match(regex))

            });

           // // getting apply links 
            const applyLink = await page.evaluate(() => {
                let applink =  document.querySelector('.avia-button-wrap.avia-button-left.avia-builder-el-24.el_after_av_hr.avia-builder-el-last  a');
                return applink ? applink.href : null;
            });

            // // getting all the cell no. 
            const cell = await page.evaluate(() => {
                let regex = /(\+49) \(?(\d{1})\)\d{3} [/] \d{4} - \d{3}|(\+49) \(?(\d{1})\) \d{3}[/]\d{4} - \d{3}|(\+49) \(?(\d{1})\) \d{2} \d{5} \d{3}|\d{4}-\d{2} \d{2} \d{2}-\d{4}|(\+49) \(?(\d{1})\) \d{2} - \d{5} \d{3}|\d{3}[/]\d{2} \d{3} \d{2}-\d{2}|(\+49) \d{2}[/]\d{5}-\d{3}|(\+49) \d{2} [/] \d{5}-\d{3}|(\+49) \(?(\d{1})\) \d{4} \d{3} \d{3}| \d{4}[/]\d{5} \d{2}|(\+49) \(?(\d{1})\) \d{2} \d{2} \d{3} - \d{3}|(\+49) \d{4} \d{3} \d{3}| \d{3} \d{6}|(\+49) \d{4} \d{3} \d{3}|\d{6}[/]\d{3} \d{3}|\d{6}-\d{3} \d{3}|\d+-\d{3} \d+|\d{3} \d{5}-\d{3}|\d{5}[/]\d{3} \d{3}|\d{4}[/]\d{5} \d{2}|\d{5} \d{3} \d{3}|\d{3} [/] \d{5}-\d{3}|(\+49) \(?(\d{1})\) \d{4}-\d{3}-\d{3}/;
                let text = Array.from(document.querySelectorAll('.avia_textblock > p')).map(el => el.innerText)
                text[6]
                return text.filter(el => el.match(regex));

            });

            /// get all the address 
            const address = await page.evaluate(() => {
                let regex = /\n.+\n.+\n.+\n./
                let text = Array.from(document.querySelectorAll('#stellenanzeige > div > div > div > div > section.av_textblock_section.av-jx7ciq53-41f278b352b9c3ffd41b8975d179a0b5 > div > p:nth-child(3)')).map(el => el.innerText);

                return text.filter(el => el.match(regex));
                
            });

            let jobDetails = {
                title,
                address,
                email,
                applyLink,
                cell,

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
TosCarrer();
