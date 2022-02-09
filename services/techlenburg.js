import puppeteer from "puppeteer";

(async function () {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    let allJobs = [];
    let allLinks = ["https://www.reha-ktl.de/karriere/offene-stellen"];
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
        return Array.from(document.querySelectorAll(".card-body a")).map(
          (el) => el.href
        );
      });

      allJobs.push(...jobs);
      counter++;

      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    console.log(allJobs);

    // getting all the data from links
    let allJobDetails = [];
    for (const url of allJobs) {
      await page.goto(url);

      scroll(page);

      await page.waitForSelector(".frame-inner");

      let jobTitles = await page.evaluate(() => {
        let jobTitle = document.querySelector(".frame-inner h1");
        return jobTitle ? jobTitle.innerText : null;
      });

      // console.log(jobTitles);

      //get cellno
      let contactNumbers = await page.evaluate(() => {
        let numberRegex = /\d+-\d+/;
        let num = Array.from(document.querySelectorAll(".frame-inner"));
        num = num.map((el) => el.innerText);
        let numbr = num.join(" ");
        numbr = numbr.match(numberRegex);
        return numbr;
      });
      // console.log(contactNumbers);

      //get location

      let contactLink = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".footer-meta a")).map(
          (l) => l.href
        );
      });

      let contctLink = contactLink[1];
      await page.goto(contctLink);

      let originalLocation = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("div.well p")).map(
          (t) => t.innerText
        );
      });
      let location = originalLocation[2];
      //  console.log(originalLocation);

      //  get email
      let email = await page.evaluate(() => {
        let emailRegex = /in[A-Za-z]+@[A-Za-z]+-?[A-Za-z]+.?de?/;
        let Originalmail = Array.from(document.querySelectorAll(".well"));
        Originalmail = Originalmail.map((el) => el.innerText);
        let emails = Originalmail.join(" ");
        emails = emails.match(emailRegex);
        return emails;
      });

      // console.log(email);

      let applyLink = url;
      // console.log(applyLink);

      // Job details
      let jobDetails = {
        jobTitles,
        contactNumbers,
        location,
        email,
        applyLink
      };

      //push job details
      allJobDetails.push(jobDetails);
      console.log(jobDetails);
    }
    await page.waitForTimeout(3000);

    // console.log(allJobDetails);
    await browser.close();

    // return allJobDetails
  } catch (error) {
    console.log(error);
  }
})();
