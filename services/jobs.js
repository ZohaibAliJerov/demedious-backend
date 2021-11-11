
import puppeteer from "puppeteer";

const celenusKerriere = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    let allJobs = [];
    let allLinks = [
      'https://www.klinik-hilchenbach.de/karriere/',
      'https://www.celenus-karriere.de/jobs/aktuellejobs/aerzte/',
      'https://www.celenus-karriere.de/salvea/aktuellejobs/aerzte/'
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
          document.querySelectorAll('.ce-bodytext > ul > li > a')
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
      await page.waitForSelector('.nc-stelle-top > h1');
      const title = await page.evaluate(() => {
        return document.querySelector('.nc-stelle-top > h1').innerText || null
      })
      // console.log(jobTitles);
      let address = await page.evaluate(() => {
        return document.querySelector('.nc-company-address').innerText;
      })

      // get all emails

      let email = await page.evaluate(() => {
        return document.querySelector('.nc-company-contactperson > div a').innerText
      });

      // get all onlineApplucation 
      let applyLink = await page.evaluate(() => {
        return document.querySelector('.nc-action-button.nc-link-form a').href
      });


      // text = text.join(",");


      let cell = await page.evaluate(() => {
        let regex = /\d{5}.?\d{6}|\d{4}.?\d{3}.?\d{2}.?\d{3}|\d{5}.?\d{3}.?\d{4}|\d{5}.?\d{3}.?\d{3}|\d{6}.?\d{2}.?\d{3}|\d{4}.?\d{4}.?\d{3}|\d{5}.?\d{2}.?\d{3}|\d{3}.?\d{3}.?\d{2}.?\d{4}|\d{5}.?\d{4}.?\d{3}|\d{4}.?\d{5}.?\d{4}|\d{5}.?\d{4}|\d{4}.?\d{2}.?\d{2}.?\d{2}.?\d{2}/;
        let text = Array.from(document.querySelectorAll("div"));
        text = text.map(el => el.innerText);
        let str = text.join(" ");
        str = str.match(regex);
        return str;
      });

      let jobDetails = {
        title,
        address,
        email,
        cell,
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
}

export default celenusKerriere;
