import puppeteer from "puppeteer";

(async function () {
    try {
      const browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      let allJobs = [];
      let allLinks = [
        'https://www.klinikum-guetersloh.de/beruf-und-karriere/stellenangebote/aerztlicher-dienst/'
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
            document.querySelectorAll('.csc-default .odd .col1 a')
          ).map((el) => el.href)
        });

        let jobs1 = await page.evaluate(() => {
            return Array.from(
              document.querySelectorAll('.csc-default #table_241074 .odd a')
            ).map((al) => al.href)
          });

          let jobs2 = await page.evaluate(() => {
            return Array.from(
              document.querySelectorAll('.csc-default .even .col1 a')
            ).map((al) => al.href)
          });
          jobs.push(...jobs1)
          jobs.push(...jobs2)
        allJobs.push(...jobs);

        counter++;
        await page.waitForTimeout(3000);
      } while (counter < allLinks.length);
      console.log(allJobs);

      // getting all the data from links
      let allJobDetails = []
      for (const url of allJobs) {
        await page.goto(url);
        scroll(page);
        await page.waitForSelector('.tx-itao-career-section h1');
        const jobTitles = await page.evaluate(() => {
          return document.querySelector('.tx-itao-career-section h1').innerText || null
        })
        // console.log(jobTitles);

        //get location
        const location = await page.evaluate(() => {
                let locationRegex = /[A-Za-z0-9]+.[A-Za-z0-9]+ü?[A-Za-z0-9]+\n?[A-Za-z0-9]+\s[A-Za-z0-9]+\s[A-Za-z0-9]+\n?[A-Za-z0-9]+\s[A-Za-z0-9]+ß?[A-Za-z0-9]+\s\d+\n?\d+\s[A-Za-z0-9]+ü?[A-Za-z0-9]+/
                let text = document.querySelector('.tx-jppageteaser-pi1-list-entry-description')
                return text ? text.innerText.match(locationRegex) : null;
            });
            // console.log(location);

        // get all emails
        const email = await page.evaluate(() => {
            let emailRegex = /[A-Za-z0-9]+.?[A-Za-z0-9]+@[A-Za-z0-9]+-?[A-Za-z0-9]+.?[A-Za-z0-9]+/
            let eText = document.querySelector('.tx-jppageteaser-pi1-list-entry-description')
            return eText ? eText.innerText.match(emailRegex) : null;
        });
        // console.log(email);

        //get pnone number
        const cell = await page.evaluate(() => {
          let cellRegex = /[0-9]+.[/].[0-9]+-[0-9]+,?|[0-9]+-[0-9]+-[0-9]+/
          let cText = document.querySelector('.jobOfferDetails')
          return cText ? cText.innerText.match(cellRegex) : null;
      });
      // console.log(cell);

        // get apply links
        let applyLink = await page.evaluate(() => {
          return document.querySelector('.tx-jppageteaser-pi1-list-entry-link-item a').href
        });
        // console.log(applyLink)
        
        /// get all the contact no.
        let jobDetails = {
          jobTitles,
          location,
          cell,
          email,
          applyLink
        }
        allJobDetails.push(jobDetails);
      }
      await page.waitForTimeout(3000);
      console.log(allJobDetails);
      await browser.close();
    //   return allJobDetails
    } catch (error) {
      console.log(error)
    }
  })();