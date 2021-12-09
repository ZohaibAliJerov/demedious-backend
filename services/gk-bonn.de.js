import puppeteer from 'puppeteer'

const gk_bonn = async () => {
    try {
        let browser = await puppeteer.launch({ headless: false });
        let page = await browser.newPage();
        page.setDefaultNavigationTimeout(0)

        let allJobs = [];
        let link = [
            "https://www.gk-bonn.de/gkbn/bildung-karriere/stellenboerse/?pageId29534281=1#list_29534",
            "https://www.gk-bonn.de/gkbn/bildung-karriere/stellenboerse/?pageId29534281=2#list_29534281"
        ];

        let counter = 0;
        do {
            await page.goto(link[counter], { timeout: 0 });
            await scroll(page);

            const job = await page.evaluate(() => {
                let links = Array.from(document.querySelectorAll('.listEntryTitle a')
                ).map(el => el.href);
                return links
            });
            allJobs.push(...job);
            console.log(job);
            counter++;
        } while (counter < link.length);



        let allJobDetails = [];
        for (const url of allJobs) {
            await page.goto(url);
            await scroll(page);


            await page.waitForSelector('h1')
            ///getting all the title from the links
            const title = await page.evaluate(() => {
                let text = document.querySelector('h1')
                return text ? text.innerText : null;
            });


            ///getting all the location

            const location = await page.evaluate(() => {
                let text = document.querySelector('.sectionInner');
                return text ? text.innerText.match(/[a-zA-Z- .]+\d+. \d+ [a-zA-Z- .]+|[a-zA-Z- .]+ \d+ . \d+[\n]\d+ [a-zA-Z- .]+|[a-zA-Z- .]+[\n][a-zA-Z- .]+[/][a-zA-Z- .]+|[a-zA-Z- .]+ \d+-\d+, \d+ [a-zA-Z- .]+|[a-zA-Z -]+ [a-zA-Z -]+ \d+[.-]\d+[\n][\n]\d+ [a-zA-Z- .]+|[a-zA-Z- .ß]+\d+[\n][\n]\d+ [a-zA-Z- .]+/) : null;
            })
            /// getting all the cell ; 
            const cell = await page.evaluate(() => {
                let text = document.querySelector('.sectionInner')
                return text ? text.innerText.match(/\d+ [/] \d+[- ]\d+|\d+[-/]\d+[-/]\d+|\d+ [/] \d+ - \d/) : null;
            })

            /// getting all the email
            const email = await page.evaluate(() => {

                let text = document.querySelector('.sectionInner');
                return text ? text.innerText.match(/[a-zA-Z.-]+@[a-zA-Z.-]+/) : null;
            });

            /// getting all the applylinks
            const applyLink = await page.evaluate(() => {
                let text = document.querySelector('.onlineBewerben');
                return text ? text.href : null;
            })
            const jobDetails = {
                title,
                location,
                cell,
                email,
                applyLink
            }
            allJobDetails.push(jobDetails);

        }
        await page.waitForTimeout(3000)
        console.log(allJobDetails)
        await page.close();
        await browser.close();
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

gk_bonn();
