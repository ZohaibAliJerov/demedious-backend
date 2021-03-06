import puppeteer from "puppeteer";
const schmallenberg = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        //scroll the page
        let allJobs = [];
        let allLinks = [
            "https://www.johannesbad-karriere.com/Stellenangebote.aspx",
        ];
        let counter = 0;
        do {
            await page.goto(allLinks[counter], {
                timeout: 0,
            });
            scroll(page);
            //  get all job links
            let jobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".position-title")).map(
                    (el) => el.href
                );
            });
            console.log(jobs);
            allJobs.push(...jobs);
            counter++;
            await page.waitForTimeout(3000);
        } while (counter < allLinks.length);
        let allJobDetails = [];
        // get data from every job post
        for (const url of allJobs) {
            await page.goto(url);
            scroll(page);

            const title = await page.evaluate(() => {
                let text = document.querySelector("h1");
                return text ? text.innerText : null;
            });

              //get contacts
              let cell = await page.evaluate(() => {
             let text =  document.querySelector(".content-container");
               text ? text.innerText.match(/\d+.\d+.\d+([-])\d+/g): null
           });
              // get email
              let email = await page.evaluate(() => {
                let text = document.querySelector('.content-container')
                return text ? text.innerText.match(/[a-z]+([@])[a-z]+([.])[a-z]+/g)
                  : null;
              });

            //   get location
              let location = await page.evaluate(() => {
                let text = document
                  .querySelector(".content-container")
                return text
                  ? text.innerText.match(
                      /[a-zA-Z.]+.\d+.[a-zA-Z]+.\d+.[a-zA-Z]+.|[A-Za-z]+.\d+\,.\d+.[A-Za-z]+/g
                    )
                  : null;
              });

              //get apply link
              let applyLink = await page.evaluate(() => {
                let text = document.querySelector("#ctl01_cphInhalt_hBewerben1");
                return text ? text.href : null;
              });
            const jobDetails = {
                title,
                cell,
                email,
                location,
                applyLink,
            };
            allJobDetails.push(jobDetails);
            await page.waitForTimeout(4000);
        }
        console.log(allJobDetails);
        await page.close();
        return allJobDetails;
    } catch (err) {
        console.log(err);
    }
};
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
schmallenberg();
export default schmallenberg
