import puppeteer from 'puppeteer';

const gfo_kliniken = async () => {
    try {

        let browser = await puppeteer.launch({ headless: false });
        let page = await browser.newPage();
        page.setDefaultNavigationTimeout(0)

        let allJobs = [];
        let link = [
            "https://www.gfo-kliniken-rhein-berg.de/arbeit-karriere/stellenangebote.html"
        ];

        let counter = 0;
        do {
            await page.goto(link[counter], { timeout: 0 });
            await scroll(page);

            const job = await page.evaluate(() => {
                let links = Array.from(document.querySelectorAll('.job-item.shuffle-item.shuffle-item--visible a')
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

            // await page.click('a.cc-btn.cc-deny')

            await scroll(page);


            await page.waitForSelector('.pageHeadline')
            ///getting all the title from the links
            const title = await page.evaluate(() => {
                let text = document.querySelector('.pageHeadline')
                return text ? text.innerText : null;
            });


            ///getting all the location

            const location = await page.evaluate(() => {
                let text = document.querySelector('body');
                return text ? text.innerText.match(/[a-zA-Z.-]+ \d+[\n]\d+ [a-zA-Z.-]+ [a-zA-Z.-]+|[a-zA-Zß.-]+ \d+. \d+ [a-zA-Zß-]+ [a-zA-Zß-]+|[a-zA-Zß-]+ \d+ [a-zA-Zß-]+ \d+ [a-zA-Zß -]+/) : null;
            })
            /// getting all the cell ; 
            const cell = await page.evaluate(() => {
                let text = document.querySelector('body')
                return text ? text.innerText.match(/\d+[-/ ]\d+[ -]\d+|\d+ [/] \d+ \d+/) : null;
            })

            /// getting all the email
            const email = await page.evaluate(() => {
                let text = document.querySelector('body');
                return text ? text.innerText.match(/[a-zA-Z.]+[(][a-zA-Z-]+[)][a-zA-Z-.]+|[a-zA-Z.]+ [(][a-zA-Z-]+[)] [a-zA-Z-.]+|[(][a-zA-Z-]+[)] [a-zA-Z-.]+|[a-zA-Z.]+@[a-zA-Z-.]+/) : null;
            });

            /// getting all the applylinks
            const applyLink = await page.evaluate(() => {
                let text = document.querySelector('.onlinebewerben.btn.btn--invert');
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

gfo_kliniken();







