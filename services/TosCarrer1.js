
import puppeteer from "puppeteer"

const TosCarrer1 = async () => {
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


            // /// get all the address 
            const address = await page.evaluate(() => {
                let regex = /[a-zA-z]+ä[a-zA-Z]+ \d+[-|/]\d+[\n]\d+ [a-zA-Z]+|[a-zA-z]+. \d+[-|/]\d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+[ß|ä][a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+|[a-zA-z]+.[a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+[ß|ä][a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+|[a-zA-z]+.[a-zA-Z]+ \d+[-|/]\d+[\n]\d+ [a-zA-Z]+|[a-zA-z]+ö[a-zA-Z]+ß[a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]ü[a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+[ß][a-zA-Z]+ \d+[\n]\d+.[a-zA-Z]ü[a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+..\d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+. \d+[\n]\d+ [a-zA-Z]ü[a-zA-Z]+|[a-zA-Z]+[ü][a-zA-Z]+ [a-zA-Z]+..\d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+[ä][a-zA-Z]+ß[a-zA-Z]+.\d+-\d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+[ä][a-zA-Z]+ß[a-zA-Z]+.\d+-\d+ [\n]\d+ [a-zA-Z]+|[a-zA-z]+.[a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+[ß|ä][a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+|[a-zA-z]+.[a-zA-Z]+ \d+[-|/]\d+[\n]\d+ [a-zA-Z]+|[a-zA-z]+ö[a-zA-Z]+ß[a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]ü[a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+[ß][a-zA-Z]+ \d+[\n]\d+.[a-zA-Z]ü[a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+..\d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+. \d+[\n]\d+ [a-zA-Z]ü[a-zA-Z]+|[a-zA-Z]+[ü][a-zA-Z]+ [a-zA-Z]+..\d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+[ä][a-zA-Z]+ß[a-zA-Z]+.\d+-\d+[\n]\d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+ \d+, \d+ [a-zA-Z]ö[a-z]+|[a-zA-Z]+ß[a-z]+ \d-\d+[\n][A-Z]-\d+ [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+[\n][a-zA-Z]+. \d+/
                let text = Array.from(document.querySelectorAll('.avia_textblock'))
                text = text.map(el => el.innerText);
                let str = text.join(" ");
                return str = str.match(regex)

            });


            // getting all the emails;  
            const email = await page.evaluate(() => {
                let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|(\w+)(\.[a-z]+)@([a-z]+)?\.[a-z]{2,3}|(\w+)(-[a-z]+)@([a-z]+)?\.[a-z]{2,3}|(\w+)([a-z]+)@([a-z]+)?\.[a-z]{2,3}|([a-z]+)(-[a-z]+)(\.[a-z]+)@([a-z]+)(\.[a-z]{2})|(\w+)@([a-z]+)(-[a-z]+)(\.[a-z]{2})|([\.)([)@([a-z]+)(-[a-z]+)(\.[a-z]{2})|(\w+)(-[a-z]{3}) (\[[a-z]{2})(]) ([a-z]{4}\.[a-z]{2})/
                let text = document.querySelector('.avia_textblock')
                return text ? text.innerText.match(regex) : null;

            });

            // getting apply links 
            const applyLink = await page.evaluate(() => {
                let applink = document.querySelector('.avia-button-wrap.avia-button-left.avia-builder-el-24.el_after_av_hr.el_before_av_textblock a');
                return applink ? applink.href : null;
            });

            // // getting all the cell no. 
            const cell = await page.evaluate(() => {
                let regex = /(\+49) \(?(\d{1})\)\d{3} [/] \d{4} - \d{3}|(\+49) \(?(\d{1})\) \d{3}[/]\d{4} - \d{3}|(\+49) \(?(\d{1})\) \d{2} \d{5} \d{3}|\d{4}-\d{2} \d{2} \d{2}-\d{4}|(\+49) \(?(\d{1})\) \d{2} - \d{5} \d{3}|\d{3}[/]\d{2} \d{3} \d{2}-\d{2}|(\+49) \d{2}[/]\d{5}-\d{3}|(\+49) \d{2} [/] \d{5}-\d{3}|(\+49) \(?(\d{1})\) \d{4} \d{3} \d{3}| \d{4}[/]\d{5} \d{2}|(\+49) \(?(\d{1})\) \d{2} \d{2} \d{3} - \d{3}|(\+49) \d{4} \d{3} \d{3}| \d{3} \d{6}|(\+49) \d{4} \d{3} \d{3}|\d{6}[/]\d{3} \d{3}|\d{6}-\d{3} \d{3}|\d+-\d{3} \d+|\d{3} \d{5}-\d{3}|\d{5}[/]\d{3} \d{3}|\d{4}[/]\d{5} \d{2}|\d{5} \d{3} \d{3}|\d{3} [/] \d{5}-\d{3}|(\+49) \(?(\d{1})\) \d{4}-\d{3}-\d{3}/;
                let text = document.querySelector('.avia_textblock ')
                return text.innerText.match(regex);
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
TosCarrer1();
