import puppeteer from 'puppeteer';

const betaKlinik = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        let allJobs = [];
        let allLinks = [
            "https://www.bg-kliniken.de/universitaetsklinikum-bergmannsheil-bochum/karriere/offene-stellen/?origin=3&area=&type=&",
            "https://www.bg-kliniken.de/universitaetsklinikum-bergmannsheil-bochum/karriere/offene-stellen/?origin=3&area=&type=&",
            "https://www.bg-kliniken.de/universitaetsklinikum-bergmannsheil-bochum/karriere/offene-stellen/?origin=3&area=&type=&",
            "https://www.bg-kliniken.de/universitaetsklinikum-bergmannsheil-bochum/karriere/offene-stellen/?origin=3&area=&type=&"
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
                    document.querySelectorAll('.fce__position.fce__position--results > ol > li a')
                ).map(el => el.href)
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

            // getting email links 
            // const email = await page.evaluate(() => {
            //     let applink = document.querySelector('.content > p a')
            //     return applink ? applink.href : null;
            // });
            let jobDetails = {
                title,
                // email,



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