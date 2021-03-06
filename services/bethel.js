import puppeteer from "puppeteer";
const bethel = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    //scroll the pageFollow link (ctrl + click)
    let allJobs = [];
    let allLinks = [
      "https://karriere.bethel.de/bethelregional.html",
      "https://karriere.bethel.de/go/0000_Gesundheitsberufe/5101501/", 
      "https://karriere.bethel.de/go/0000_Gesundheitsberufe/5101501/100/?q=&sortColumn=referencedate&sortDirection=desc",
      "https://karriere.bethel.de/go/0000_Gesundheitsberufe/5101501/200/?q=&sortColumn=referencedate&sortDirection=desc",
      
    ];
    let counter = 0;
    do {
      await page.goto(allLinks[counter], {
        timeout: 0,
      });
      scroll(page);
      //  get all job links
      if (await page.click("#content > div > div.threeimagecaption.threeimagecaption6edb76a16629c77a.center.unmodified.backgroundimage.displayDTM.backgroundcolor72228158 > div.column.column1 > div > div.imagelink > div > a")){
        continue;
      }else{
        break;
      }
      let jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".jobTitle-link")).map(el=>el.href)
      });
      console.log(jobs);
      allJobs.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    // let allJobDetails = [];
    // // get data from every job post
    // for (const url of allJobs) {
    //   await page.goto(url);
    //   scroll(page);

    //   const title = await page.evaluate(() => {
    //     let text = document.querySelector(".searchResultsShell > table > tbody .jobTitle.hidden-phone");
    //     return text ? text.innerText : null;
    //   });

    //     //get contacts
    //     await page.waitForSelector(".content-block-list");
    //     let cell = await page.evaluate(() => {
    //         let text = document.getElementsByClassName("content-block-list__item")[4]
    //         return text ? text.innerText.match(/\d{4}\/\d{2}.\d{2}.\d{3}|\d{5}.\d{3}.\d{4}|\d{5}\-\d{3}.\/.\d{4}|\d{5}.\d{7}|\d{5}\-\d{9}/g) : null;
    //     });
    //   //     // get email
    //   let email = await page.evaluate(() => {
    //     let text = document
    //       .querySelector(".content-block-list__container")
    //       .getElementsByTagName("article")[4];
    //     return text
    //       ? text.innerText.match(/[a-z.]+[a-z]+.\[at].[a-z-]+[a-z.]+[a-z.]+/g)
    //       : null;
    //   });

    //   // get location
    //   await page.waitForSelector(".content-block-list");
    //   let location = await page.evaluate(() => {
    //     let text = document
    //       .querySelector(".content-block-list")
    //       .getElementsByTagName("article")[4];
    //     return text
    //       ? text.innerText.match(
    //         /[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z-]+.[a-zA-Z-]+.[a-zA-Z]+.\d{6}.[a-zA-Z]+|[a-zA-Z-]+[a-zA-Z-]+[a-zA-Z]+\W{1}\w{1}.\d+\,.\d{5}.[a-zA-Z]+.|[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+.\n\s[a-zA-Z-]+.[a-zA-Z-]+.[a-zA-Z]+.\d+\n\s\d{5}.[a-zA-Z]+./g
    //       )
    //       : null;
    //   });

    //   //get apply link
    //   await page.waitForSelector(".dialog__content");
    //   let applyLink = await page.evaluate(() => {
    //     let text = document.querySelector(".dialog__content >a");
    //     return text ? text.href : null;
    //   });
    //   const jobDetails = {
    //     title,
    // //     cell,
    // //     email,
    // //     location,
    // //     applyLink,
    //   };
    //   allJobDetails.push(jobDetails);
    //   await page.waitForTimeout(4000);
    // }
    // console.log(allJobDetails);
    // await page.close();
    // return allJobDetails;
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
bethel();
export default bethel;
