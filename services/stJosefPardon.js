import puppeteer from 'puppeteer'

const stJosefPar = async () => {
    try {
        const browser = await puppeteer.launch({headless : false});
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
            const applyLink = await page.evaluate(() => {
                let applink =  document.querySelector('.col.col1 > div > a');
                return applink ? applink.href : null;
            });

             //     /// get all the address 
            const address = await page.evaluate(() => {
                let adr = document.querySelector('.col.col2');
                return adr ? adr.innerText : null;
            });
            // getting all the emails;  
            const email = await page.evaluate(() => {
                let regex = /(\w+)(\.[a-z]+)@([a-z]+)?\.[a-z]{2,3}|(\w+)(-[a-z]+)@([a-z]+)?\.[a-z]{2,3}|(\w+)([a-z]+)@([a-z]+)?\.[a-z]{2,3}|([a-z]+)(-[a-z]+)(\.[a-z]+)@([a-z]+)(\.[a-z]{2})|(\w+)@([a-z]+)(-[a-z]+)(\.[a-z]{2})|([\.)([)@([a-z]+)(-[a-z]+)(\.[a-z]{2})|(\w+)(-[a-z]{3}) (\[[a-z]{2})(]) ([a-z]{4}\.[a-z]{2})/
                let text = Array.from(document.querySelectorAll('.col.col2 > div > div > p')).map(el => el.innerText);
                return text.filter(el => el.match(regex))

            });

       

            // // getting all the cell no. 
            // const cell = await page.evaluate(() => {
            //     let regex = /\d+ [/] \d{3}-\d+/;
            //     let text = Array.from(document.querySelectorAll('.col.col1')).map(el => el.innerText)
            //     return text.filter(el => el.match(regex));

            // });

       

            let jobDetails = {
                title,
                applyLink,
                address,
                // cell,
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