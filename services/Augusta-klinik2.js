import puppeteer from "puppeteer";

(async function () {
    try {
      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      let allJobs = [];
      let allLinks = [
        'https://www.augusta-kliniken.de/bildung-karriere/stellenangebote.html'
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
            document.querySelectorAll('div.text a')
          ).map((el) => el.href)
        });
        allJobs.push(...jobs)
        counter++;
        await page.waitForTimeout(3000);
      } while (counter < allLinks.length);
      console.log(allJobs);
      // getting all the data from links
      let allJobDetails = []
      for (const url of allJobs) {
        await page.goto(url);
        scroll(page);
        let wFs = await page.waitForSelector('h1.text-center');
        wFs ? wFs: null;       
        let jobTitles = await page.evaluate(() => {
          let jobTitle = document.querySelector('h1.text-center');
         return jobTitle ? jobTitle.innerText : null;
        })
        console.log(jobTitles);
        //  let adress = await page.evaluate(() => {
        //   return document.querySelector('#article-943 > div > p:nth-child(17)').innerText;
        // })
        // get all emails
        //  let email = await page.evaluate(() => {
        //  return document.querySelector('#article-943 > div > p:nth-child(18) > a').innerText
        //  });
         // get all onlineApplucation
        //  let applyLink = await page.evaluate(() => {
        //   return document.querySelector('#article-943 > div > p:nth-child(23) > a').href
        // });
        /// get all the contact no.
        let jobDetails = {
          // jobTitles,
          // adress,
          // email,
           // contactNo,
          // applyLink
        }
        // allJobDetails.push(jobDetails);
      }
      await page.waitForTimeout(3000);
      // console.log(allJobDetails);
      await browser.close();
      // return allJobDetails
      
    } catch (error) {
      console.log(error)
    }
  })();