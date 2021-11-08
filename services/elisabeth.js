import puppeteer from "puppeteer";

const elisabeth = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(
      "https://www.elisabethgruppe.de/untermenue/karriere-bildung/jobportal-stellenangebote.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    //shutt the dialog
    await page.waitForSelector(
      "button#uc-btn-accept-banner.uc-btn-new.uc-btn-new.uc-btn-accept"
    );
    await page.click(
      "button#uc-btn-accept-banner.uc-btn-new.uc-btn-new.uc-btn-accept"
    );
    await page.waitForTimeout(5000);

    let allPageLinks = [];

    let pages = await page.evaluate(() => {
      let links = Array.from(document.querySelectorAll("div.liste_seiten > a"));
      links = links.map((el) => {
        return el.href;
      });
      return links;
    });
    //    console.log(pages);
    pages = pages.slice(1, pages.length);
    allPageLinks.push(...pages);

    //    console.log(allPageLinks);

    let allJobLinks = [];
    //get all joblinks
    for (let pageLink of allPageLinks) {
      //visit each page
      await page.goto(pageLink, {
        waitUntil: "load",
        timeout: 0,
      });

      //scroll down
      await scroll(page);

      //select jobs and take urls
      let JobLinks = await page.evaluate(() => {
        return [
          ...document.querySelectorAll("span.headerlink.stellenlink > a"),
        ].map((job) => job.href);
      });
      allJobLinks.push(...JobLinks);
      await page.waitForTimeout(3000);
    }
    //    console.log(allJobLinks);
    let allJobs = [];
    for (let jobLink of allJobLinks) {
      //visit each job link
      await page.goto(jobLink, { waitUntil: "load", timeout: 0 });
      //   await page.waitForTimeout(1000);

      scroll(page);
      await page.waitForTimeout(5000);
      let newJob = {};

      //get title

      let title = await page.evaluate(() => {
        let selector1 = document.querySelector("div#con_1 > font > font");
        let selector2 = document.querySelector("div#con_1");

        return selector1?.innerText || selector2?.innerText;
      });
      newJob.title = title;

      //get address
      await page.waitForSelector("div#con_2 > div");
      let address = await page.evaluate(() => {
        let adrs = document.querySelector("div#con_2 > div");
        return adrs ? adrs.innerText : null;
      });
      newJob.address = address;

      //get email
      // email is not available
      newJob.email = null;

      //get cell
      let cell = await page.evaluate(() => {
        let cellNo = document.querySelector("div#con_38 > div");
        return cellNo
          ? cellNo.innerText.match(/\d+.-.\d+-\d+|\d+.-.\d+.-.\d+/)
          : null;
      });

      newJob.cell = cell;

      await page.waitForSelector("span#probew > a");
      let applyLink = await page.evaluate(() => {
        let link = document.querySelector("span#probew > a ");
        return link ? link.href : null;
      });
      newJob.applyLink = applyLink;

      allJobs.push(newJob);
    }

    console.log(allJobs);
    await browser.close();
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

export default elisabeth;
