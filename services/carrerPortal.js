
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let dreifaltHospital = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
            let jobLinks = []
            let allLinks = [
                'https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=16'
            ]
            let counter = 0;
            do {
                await page.goto(allLinks[counter], { timeout: 0 })
                scroll(page)
    
                // getting all the links 
                const links = await page.evaluate(() => {
                    return Array.from(
                        document.querySelectorAll('.joboffer_title_text.joboffer_box a')
                        )
                        .map(el => el.href)
                });
                // console.log(links)
                jobLinks.push(...links);
                counter++
            } while (counter > allLinks.length);
            console.log(jobLinks)
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Lippstadt",
        hospital: "Dreifaltigkeits-Hospital",
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
        let ttitle = document.querySelector("span.big");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt" ||
        level == "Arzt" ||
        level == "Oberarzt"
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
        let applink = document.querySelector('#btn_online_application a')
        return applink ? applink.href : "";
    });
    //   if (typeof link == "object") {
    //     job.link = link;
    //   }
      // console.log(job);
      job.link = link
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

kathrana_kathe()


// import puppeteer from 'puppeteer';

// const carrerPortal = async () => {
//     try {

//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0);


//         let allJobs = []
//         let link = [];

//         let counter = 0;

//         do {
//             await page.goto(link[counter], { timeout: 0 });
//             scroll(page);

//             // getting all the links

//             const jobs = await page.evaluate(() => {
//                 return Array.from(document.querySelectorAll('.joboffer_title_text.joboffer_box a')
//                 ).map(el => el.href)
//             })
//             console.log(jobs);
//             allJobs.push(...jobs);
//             counter++;
//         } while (counter < link);

//         const allJobDetails = [];

//         for (const urls of allJobs) {
//             await page.goto(urls);
//             scroll(page);

//             //getting all the title.

//             await page.waitForSelector('h1');
//             const title = await page.evaluate(() => {
//                 return document.querySelector('h1').innerText || null;
//             });

//             /// getting all the location 

//             const location = await page.evaluate(() => {
//                 let regex = /[a-zA-Z0-9]+. [a-zA-Z0-9]+ [a-zA-Z0-9]+ [a-zA-Z0-9ö]+[\n][a-zA-Z0-9 ]+ \d+[-|/]\d+ [a-zA-Z0-9 ö]+|[a-zA-Z0-9ß]+[ ]\d+[\n]\d+ [a-zA-Z0-9]+.|[a-zA-Z0-9]+. [a-zA-Z0-9]+ [a-zA-Z0-9]+ [a-zA-Z0-9]+[\n][a-zA-Z0-9 ]+ \d+|[a-zA-Z0-9]+. [a-zA-Z0-9]+ [a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+[\n][a-zA-Z0-9]+|[a-zA-Z0-9]+. [a-zA-Z0-9]+ [a-zA-Z0-9]+ [a-zA-Z0-9]+.[a-zA-Z0-9]+[\n][a-zA-Z0-9]+/
//                 let text = document.querySelector('.scheme-display')
//                 return text ? text.innerText.match(regex) : null;

//             });

//             /// getting all the cell no 

//             const cell = await page.evaluate(() => {
//                 let regex = /[+]\d+ \d+ \d+-\d+/
//                 let text = document.querySelector(".scheme-display");
//                 return text ? text.innerText.match(regex) : null;
//             });

//             // getting all the emails 
//             const email = await page.evaluate(() => {
//                 let regex = /[a-zA-Z]+.[a-zA-Z-]+[a-zA-Z]+@[a-zA-Z]+.[a-zA-Z]+/
//                 let text = document.querySelector(".scheme-display");
//                 return text ? text.innerText.match(regex) : null;
//             });

//             /// getting all the applybtn
//             const applyLink = await page.evaluate(() => {
//                 const apply = document.querySelector('#btn_online_application a');
//                 return apply ? apply.href : null;
//             })
//             const jobDetails = {
//                 title,
//                 location,
//                 cell,
//                 email,
//                 applyLink
//             }
//             allJobDetails.push(jobDetails);
//             await page.waitForTimeout(3000);
//         }
//         console.log(allJobDetails);
//         await page.close();
//         await browser.close();
//         return allJobDetails
//     } catch (error) {
//         console.log(error)
//     }
// }


// async function scroll(page) {
//     await page.evaluate(() => {
//         const distance = 100;
//         const delay = 100;
//         const timer = setInterval(() => {
//             document.scrollingElement.scrollBy(0, distance);
//             if (
//                 document.scrollingElement.scrollTop + window.innerHeight >=
//                 document.scrollingElement.scrollHeight
//             ) {
//                 clearInterval(timer);
//             }
//         }, delay);
//     });
// }

// carrerPortal()