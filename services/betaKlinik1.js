import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];

let betaKlinik = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.betaklinik.de/beta-klinik/stellenangebote/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".vc_gitem-link ")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Bonn",
        hospital: "Beta Klinik",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".content > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"
      ) {
        job.position = "artz";
      }
      if (position == "pflege" || (position == "Pflege" && !level in levels)) {
        job.position = "pflege";
        job.level = "Nicht angegeben";
      }

      if (!position in positions) {
        continue;
      }

      //get link
      let link = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/);
      });
      if (typeof link == "object") {
        job.link = link;
      }
      // console.log(job);
      allJobs.push(job);
    }
    console.log(allJobs)
    await page.close();
    await browser.close();
    return allJobs.filter((job) => job.position != "");
    
  } catch (e) {
    console.log(e);
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

betaKlinik();



// import puppeteer from 'puppeteer';

// const beraLinaKlinik = async () => {
//     try {
//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0);

//         let allJobs = [];
//         let allLinks = [
//             "https://www.berolinaklinik.de/aktuelles/stellenangebote/"
//         ]
//         async function scroll(page) {
//             await page.evaluate(() => {
//                 const distance = 100;
//                 const delay = 100;
//                 const timer = setInterval(() => {
//                     document.scrollingElement.scrollBy(0, distance);
//                     if (
//                         document.scrollingElement.scrollTop + window.innerHeight >=
//                         document.scrollingElement.scrollHeight
//                     ) {
//                         clearInterval(timer);
//                     }
//                 }, delay);
//             });
//         }
//         let counter = 0;
//         do {
//             await page.goto(allLinks[counter], { timeout: 0 });
//             scroll(page);

//             // get all jobs links 

//             let jobs = await page.evaluate(() => {
//                 return Array.from(
//                     document.querySelectorAll('.news-list-container > ul > li > .news-list-item > h3 a')
//                 ).map(el => el.href)
//             });
//             allJobs.push(...jobs)

//             counter++;
//             await page.waitForTimeout(3000);
//         } while (counter < allLinks);
//         console.log(allJobs);

//         const allJobDetails = [];
//         // get all the data from stored links 
//         for (const urls of allJobs) {
//             await page.goto(urls)
//             scroll(page);

//             // gettingg all the Title of the links 
//             await page.waitForSelector('h1')
//             const title = await page.evaluate(() => {
//                 let Title = document.querySelector('h1');
//                 return Title ? Title.innerText : null;
//             });

//             // getting all the address 
//             const address = await page.evaluate(() => {
//                 let regex = /[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+ [&] [a-zA-Z]+. [a-zA-Z]+ [a-zA-Zü]+. \d+.\d+ [a-zA-Zö]+|[a-zA-Züß]+ \d+, \d+ [a-zA-Zö]+/;
//                 let adr = document.querySelector('.contentboxinner')
//                 return adr ? adr.innerText.match(regex) : null;

//             });
//             // getting all the cell no. 
//             const cell = await page.evaluate(() => {
//                 let regex = /\d{1} \d{2} \d{2}[/]\d+ \d{2} - \d+ \d+|\d+ \d+-\d+| \d+ \d+ \d+ [/] \d+ \d+ - \d+ \d+/;
//                 let text = Array.from(document.querySelectorAll('.contentboxinner'))
//                 text = text.map(el => el.innerText)
//                 let str = text.join(" ");
//                 str = str.match(regex);
//                 return str;

//             });
//             // getting email links 
//             const email = await page.evaluate(() => {
//                 let regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+|[a-zA-Z0-9]+ @[a-zA-Z0-9-]+\ [a-z]\w+ \.[a-z]+/
//                 let text = document.querySelector('.contentboxinner');
//                 return text ? text.innerText.match(regex) : null;
//             });
//             let jobDetails = {
//                 title,
//                 address,
//                 cell,
//                 email,



//             }
//             allJobDetails.push(jobDetails);
//         }
//         await page.waitForTimeout(3000);
//         console.log(allJobDetails);
//         await browser.close();
//         return allJobDetails
//     } catch (error) {
//         console.log(error)
//     }
// }

// beraLinaKlinik();


// import puppeteer from 'puppeteer';

// const betaKlinik = async () => {
//     try {
//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0);

//         let allJobs = [];
//         let allLinks = [
//             'https://www.betaklinik.de/beta-klinik/stellenangebote/'
//         ]

//         async function scroll(page) {
//             await page.evaluate(() => {
//                 const distance = 100;
//                 const delay = 100;
//                 const timer = setInterval(() => {
//                     document.scrollingElement.scrollBy(0, distance);
//                     if (
//                         document.scrollingElement.scrollTop + window.innerHeight >=
//                         document.scrollingElement.scrollHeight
//                     ) {
//                         clearInterval(timer);
//                     }
//                 }, delay);
//             });
//         }
//         let counter = 0;
//         do {
//             await page.goto(allLinks[counter], { timeout: 0 });
//             scroll(page);

//             // get all jobs links 

//             let jobs = await page.evaluate(() => {
//                 return Array.from(
//                     document.querySelectorAll('.vc_custom_heading.vc_custom_1562575030398.vc_gitem-post-data.vc_gitem-post-data-source-post_title > h3 a')
//                 ).map(el => el.href)
//             });
//             allJobs.push(...jobs)

//             counter++;
//             await page.waitForTimeout(3000);
//         } while (counter < allLinks);
//         console.log(allJobs);

//         const allJobDetails = [];
//         // get all the data from stored links 
//         for (const urls of allJobs) {
//             await page.goto(urls)
//             scroll(page);

//             // gettingg all the Title of the links 
//             await page.waitForSelector('h1')
//             const title = await page.evaluate(() => {
//                 let Title = document.querySelector('h1');
//                 return Title ? Title.innerText : null;
//             });

//             // getting apply links 
//             const email = await page.evaluate(() => {
//                 let applink = document.querySelector('.content > p a')
//                 return applink ? applink.href : null;
//             });

//             // /// get all the address 
//             const address = await page.evaluate(() => {
//                 let regex = /[a-zA-Z]+-[a-zA-Z]+-[a-zA-Z]+ \d+[\n]\d+ [a-zA-Z]+/
//                 let adr = document.querySelector('.content');
//                 return adr ? adr.innerText.match(regex) : null;
//             });

//             // // // getting all the cell no. 
//             // const cell = await page.evaluate(() => {
//             //     let regex = /\d+ [/] \d{3}-\d+|\d+ \d{3}-\d{4}|\d{5} \d{3} \d{4}|[(]\d+[)] \d+ \d+|\d{5}[/]\d{7}|\d{5}[/]\d{5} \d{4}|\d{5} \d{5}/;
//             //     let text = Array.from(document.querySelectorAll('.col.col1 p'));
//             //     text = text.map(el => el.innerText)
//             //     let str = text.join(" ");
//             //     str = str.match(regex);
//             //     return str;

//             // });

//             let jobDetails = {
//                 title,
//                 address,
//                 email,



//             }
//             allJobDetails.push(jobDetails);
//         }
//         await page.waitForTimeout(3000);
//         console.log(allJobDetails);
//         await browser.close();
//         return allJobDetails
//     } catch (error) {
//         console.log(error)
//     }
// }

// betaKlinik();