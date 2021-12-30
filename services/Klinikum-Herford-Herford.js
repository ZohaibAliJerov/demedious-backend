import puppeteer from "puppeteer";

(async function () {
    try {
      const browser = await puppeteer.launch({ headless: true })
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      let allJobs = [];
      let allLinks = [
        'https://www.klinikum-herford.de/karriere/stellenangebote-fuer-aerzte?f[9256][p]=1',
        'https://www.klinikum-herford.de/karriere/stellenangebote-fuer-aerzte?f[9256][p]=2'
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
            document.querySelectorAll('.element_group a')
          ).map((el) => el.href)
        });
        allJobs.push(...jobs)
        counter++;
        await page.waitForTimeout(3000);
      } while (counter < allLinks.length);
    //   console.log(allJobs);

    //   getting all the data from links
      let allJobDetails = []
      for (const url of allJobs) {
        await page.goto(url);
        scroll(page);
        await page.waitForSelector('.headline-row h1');
        const jobTitles = await page.evaluate(() => {
          return document.querySelector('.headline-row h1').innerText || null
        })
        // console.log(jobTitles);

        //get location
        let location = await page.evaluate(() => {
            let regex = /[A-Za-z]+.?[A-Za-z]+\n[A-Za-z]+.[A-Za-z]+\n[A-Za-z]+.[A-Za-z]+\s\d+\n\d+\s[A-Za-z]+/
            let text = document.querySelector('#e9355')
            return text ? text.innerText.match(regex) : null;
        });
        // console.log(location);
        
        //get phone no
        let cell = await page.evaluate(() => {
            return document.querySelector('.col-md-6 .btn').innerText
          });

        // get all emails
        let email = await page.evaluate(() => {
            let emailRegex = /[[A-Za-z]+@[A-Za-z]+-?[A-Za-z]+.?[A-Za-z]+/
            let emails = document.querySelector('#e9355')
            return emails ? emails.innerText.match(emailRegex) : null;
        });
        // console.log(email);

        // get all online apply link
        let applyLink = await page.evaluate(() => {
          return document.querySelector('.col-md-4 a').href
        });
        // console.log(applyLink);

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
      return allJobDetails
    } catch (error) {
      console.log(error)
    }
  })();