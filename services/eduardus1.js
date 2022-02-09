import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let eduardus_De1 = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
            let jobLinks = []
            let allLinks = [
                "https://eduardus.de/mitarbeit-karriere/fuer-bewerber/stellenmarkt/"
            ]
            let counter = 0;
            do {
                await page.goto(allLinks[counter], { timeout: 0 })
                scroll(page)
                await page.click('body > main > div.container-fluid.sortable > div > div.col-02-exclude > div > div.job-list.teaserbox > button')
    
                // getting all the links 
                const links = await page.evaluate(() => {
                    return Array.from(
                        document.querySelectorAll('tbody a')
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
        location: "Köln",
        hospital: "Eduardus-Krankenhaus gGmbH",
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
        let ttitle = document.querySelector("h1");
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
        let applink = document.querySelector('.cr.button > div a')
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

eduardus_De1()

// import puppeteer from "puppeteer";

// const eduardus_De1 = async () => {
//     try {
//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0);

//         let allJobs = [];
//         let link = ["https://eduardus.de/mitarbeit-karriere/fuer-bewerber/stellenmarkt/"]

//         let counter = 0;
//         do {
//             await page.goto(link[counter], { timeout: 0 })
//             scroll(page);
//             await page.click('body > main > div.container-fluid.sortable > div > div.col-02-exclude > div > div.job-list.teaserbox > button')
//             //getting all the jobs links 


//             await page.waitForTimeout(3000)
//             const jobs = await page.evaluate(() => {
//                 return Array.from(
//                     document.querySelectorAll('tbody a')
//                 ).map(el => el.href)
//             });
//             console.log(jobs);
//             allJobs.push(...jobs);
//             counter++;
//         } while (counter < link.length);

//         const allJobDetails = []

//         for (const url of allJobs) {
//             await page.goto(url)
//             await scroll(page)
//             /// getting all the title
//             await page.waitForSelector('h1')
//             const title = await page.evaluate(() => {
//                 return document.querySelector('h1').innerText || null;
//             })

//             /// getting all the cell no.
//             const cell = await page.evaluate(() => {
//                 let text = document.querySelector('.story.increase');
//                 return text ? text.innerText.match(/\d+[/] \d+[ -]\d+|[(]\d+[)][/ ]\d+[ -]\d+|\d+[/ ]\d+.[- ]\d+.\d+/) : null;
//             });

//             // getting all the location from the links 
//             const location = await page.evaluate(() => {
//                 let text = document.querySelector('.story.increase');
//                 return text ? text.innerText.match(/[a-zaA-Z]+ [a-zA-Z]+|[a-zA-Z. ]+\d+-\d+[\n]\d+ [a-zA-Z]+/) : null;
//             });

//             /// getting all the emails 
//             const email = await page.evaluate(() => {
//                 let text = document.querySelector('.story.increase');
//                 return text ? text.innerText.match(/[a-zaA-Z-]+@[a-zA-Z.]+/) : null;
//             });

//             const applyLink = await page.evaluate(() => {
//                 let text = document.querySelector('.cr.button a')
//                 return text ? text.href : null;
//             })

//             const jobDetails = {
//                 title,
//                 cell,
//                 location,
//                 email,
//                 applyLink
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

// eduardus_De1();