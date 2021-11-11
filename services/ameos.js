import puppeteer from 'puppeteer';

const ameos = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        const allJobs = [];
        const alllink = [
            'https://www.ameos.eu/standorte/ameos-west/oberhausen/ameos-klinikum-st-clemens-oberhausen/karriere/stellenangebote/',
            'https://www.ameos.eu/standorte/ameos-west/oberhausen/ameos-klinikum-st-clemens-oberhausen/karriere/stellenangebote/',
            'https://www.ameos.eu/standorte/ameos-west/oberhausen/ameos-klinikum-st-clemens-oberhausen/karriere/stellenangebote/'
        ];

        // scroll method 
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
        //get all the links from the website 
        let counter = 0
        do {
            await page.goto(alllink[counter], { timeout: false });
            scroll(page);

            // urls of the website
            let jobs = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll('.row.content.job.ng-scope > col-10 a')
                ).map(el => el.href)
            })
            allJobs.push(...jobs)
            counter++;
            await page.waitForTimeout(5000);
            console.log(jobs);
        } while (counter < alllink.length);

        console.log(allJobs)
        await browser.close();
    } catch (error) {
        console.log(error)
    }
}
ameos();