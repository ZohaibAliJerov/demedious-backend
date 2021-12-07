import puppeteer from "puppeteer";
const wuppertal = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.helios-gesundheit.de/kliniken/wuppertal/unser-haus-karriere-presse/karriere/stellenangebote/",
      "https://www.helios-gesundheit.de/kliniken/wuppertal/unser-haus-karriere-presse/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=2&cHash=dacf652f0a4905f03823ca092820ee4d",
      "https://www.helios-gesundheit.de/kliniken/wuppertal/unser-haus-karriere-presse/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=3&cHash=f58d93fedde7e147e7d4f52eed43e5d1",
      "https://www.helios-gesundheit.de/kliniken/wuppertal/unser-haus-karriere-presse/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=4&cHash=81aa6a60473889e8548a205757d0dab6",
      "https://www.helios-gesundheit.de/kliniken/wuppertal/unser-haus-karriere-presse/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=5&cHash=20268dcd0ca08b577c486bba485772f4",
      "https://www.helios-gesundheit.de/kliniken/wuppertal/unser-haus-karriere-presse/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=6&cHash=a760e30713594e972753eda4499f962f",
      "https://www.helios-gesundheit.de/kliniken/wuppertal/unser-haus-karriere-presse/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=7&cHash=0fd105302f8d307390dce0bb4da14681",
      "https://www.helios-gesundheit.de/kliniken/wuppertal/unser-haus-karriere-presse/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=8&cHash=331d73f05cea8be706bbffa28106d2e8",
    ];
    let counter = 0;
    do {
      await page.goto(allLinks[counter], {
        timeout: 0,
      });
      scroll(page);
      //  get all job links
      let jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".tabular-list__link")).map(
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
        let text = document.querySelector(".billboard-panel__body > h2");
        return text ? text.innerText : null;
      });

      //get contacts
      let cell = await page.evaluate(() => {
        let text = document
          .querySelector(".content-block-list__container")
          .getElementsByTagName("article")[4];
        return text
          ? text.innerText.match(
            /\+\d+.\d+.\d+|\d+.\/.\d+[-/]\d+/g
            )
          : null;
      });
    //   // get email
    //   let email = await page.evaluate(() => {
    //     let text = document
    //       .querySelector(".content-block-list__container")
    //       .getElementsByTagName("article")[4];
    //     return text
    //       ? text.innerText.match(
    //           /[a-zA-Z]+.[a-zA-Z-]+.[a-zA-Z]+.\[at\].[a-zA-Z-]+.[a-zA-Z.]+.[a-zA-Z]+./g
    //         )
    //       : null;
    //   });

    //   //   get location
    //   let location = await page.evaluate(() => {
    //     let text = document
    //       .querySelector(".content-block-list")
    //       .getElementsByTagName("article")[4];
    //     return text
    //       ? text.innerText.match(
    //           /[a-zA-Z.]+.\d+.[a-zA-Z]+.\d+.[a-zA-Z]+.|[a-zA-Z]+\W{1}[a-zA-Z]+\W{1}[a-zA-Z]+.\d+[,/].\d+.[a-zA-Z]+/g
    //         )
    //       : null;
    //   });

    //     //get apply link
    //     let applyLink = await page.evaluate(() => {
    //       let text = document.querySelector(".dialog__content >a");
    //       return text ? text.href : null;
    //     });
      const jobDetails = {
        title,
        cell,
        // email,
        // location,
        // applyLink,
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
wuppertal();
export default wuppertal;
