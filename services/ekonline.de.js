
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let ekonline_de = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
            let jobLinks = []
            let allLinks = [
                "https://www.ekonline.de/karriere/fuer-bewerber/stellenangebote.html"
            ]
            let counter = 0;
            do {
                await page.goto(allLinks[counter], { timeout: 0 })
                scroll(page)
                
                // getting all the links 
                const links = await page.evaluate(() => {
                    return Array.from(
                        document.querySelectorAll('h3.media-heading.visible-xs a' )
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
        location: "Recklinghausen",
        hospital: "Elisabeth Krankenhaus Recklinghausen",
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
        let ttitle = document.querySelector("h2");
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
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/);
    });
      if (typeof link == "object") {
        job.link = link;
      }
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

ekonline_de()

// import puppeteer from "puppeteer";

// const ekonline_de = async () => {
//     try {
//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0);

//         let allJobs = [];
//         let link = ["https://www.ekonline.de/karriere/fuer-bewerber/stellenangebote.html"]

//         let counter = 0;
//         do {
//             await page.goto(link[counter], { timeout: 0 })
//             scroll(page);

//             //getting all the jobs links 


//             await page.waitForTimeout(3000)
//             const jobs = await page.evaluate(() => {
//                 return Array.from(
//                     document.querySelectorAll('')
//                 ).map(el => el.href)
//             });
//             console.log(jobs);
//             allJobs.push(...jobs);
//             counter++;
//         } while (counter < link);

//         const allJobDetails = []

//         for (const url of allJobs) {
//             await page.goto(url)
//             await scroll(page)
//             /// getting all the title
//             await page.waitForSelector('h2')
//             const title = await page.evaluate(() => {
//                 return document.querySelector('h2').innerText || null;
//             })

//             /// getting all the cell no.
//             const cell = await page.evaluate(() => {
//                 let text = document.querySelector('.frame.frame-type-list.frame-layout-0.ce-default.col-xs-12');
//                 return text ? text.innerText.match(/\d+ [/] \d+[-]\d+|\d+[/ ]\d+-\d+/) : null;
//             });

//             // getting all the location from the links 
//             const location = await page.evaluate(() => {
//                 let text = document.querySelector('.frame.frame-type-list.frame-layout-0.ce-default.col-xs-12');
//                 return text ? text.innerText.match(/[a-zA-Z]+.[a-zA-Zß]+. \d+[\n]\d+ [a-zA-Z., ]+/) : null;
//             });

//             /// getting all the emails 
//             const email = await page.evaluate(() => {
//                 let text = document.querySelector('.frame.frame-type-list.frame-layout-0.ce-default.col-xs-12');
//                 return text ? text.innerText.match(/[a-zA-Z]+ [(][a-zA-Z]+[)] [a-zA-Z.]+|[a-zA-Z]+[(][a-zA-Z]+[)][a-zA-Z.]+|[a-zA-Z]+@[a-zA-Z.]/) : null;
//             });

//             const jobDetails = {
//                 title,
//                 cell,
//                 location,
//                 email,

//             };
//             allJobDetails.push(jobDetails);
//             await page.waitForTimeout(3000);
//         }
//         console.log(allJobDetails);
//         await page.close();
//         await browser.close();
//         return allJobDetails;
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
// };

// ekonline_de();