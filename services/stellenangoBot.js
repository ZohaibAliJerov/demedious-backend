import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let stellenangobotOnline = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    let url = [ "https://www.stellenangebot.online/category/orte/58769-nachrodt-wiblingwerde/"]

        let allJobLinks = []
        let counter = 0
        do {
            await page.goto(url[counter], {
                waitUntil: "load",
                timeout: 0,
            });
            //wait for a while
            await page.waitForTimeout(1000);

            //scroll the page
            await scroll(page)

            //get all jobLinks
            let jobLinks = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll("h1.entry-title a")
                ).map((el) => el.href);
            });
            allJobLinks.push(...jobLinks)
            counter++;

        } while (counter < url.length);
        console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      let job = {
        title: "",
        location: "Nachrodt-Wiblingwerde",
        hospital: "Gut Sassenscheid",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink)
    //   await page.waitForTimeout(3000)
    //   await page.waitForSelector('h1')
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
        let applyLink = document.querySelector('.entry-content');
        return applyLink ? applyLink.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/) : "";
      
      })
        job.link = link
        allJobs.push(job);
    }
    console.log(allJobs);
    await browser.close();
    await page.close();
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

stellenangobotOnline()
// export default ugos_deParkKlinik;







// import puppeteer from 'puppeteer';

// const stellenangobotOnline = async () => {
//     try {

//         let browser = await puppeteer.launch({ headless: false });
//         let page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0)

//         let allJobs = [];
//         let link = [];

//         let counter = 0;
//         do {
//             await page.goto(link[counter], { timeout: 0 });
//             await scroll(page);

//             const job = await page.evaluate(() => {
//                 let links = Array.from(document.querySelectorAll('h1.entry-title a')
//                 ).map(el => el.href);
//                 return links
//             });
//             allJobs.push(...job);
//             console.log(job);
//             counter++;
//         } while (counter < link.length);

//         let allJobDetails = [];


//         for (const url of allJobs) {
//             await page.goto(url);

//             // await page.click('a.cc-btn.cc-deny')

//             await scroll(page);


//             await page.waitForSelector('#post-11306 > div > p:nth-child(3)')
//             ///getting all the title from the links
//             const title = await page.evaluate(() => {
//                 let text = document.querySelector('#post-11306 > div > p:nth-child(3)')
//                 return text ? text.innerText : null;
//             });


//             ///getting all the location

//             const location = await page.evaluate(() => {
//                 let text = document.querySelector('body');
//                 return text ? text.innerText.match(/[a-zA-Zßü]+ [\d,]+[\n]\d+ [a-zA-Zßü -]+|[a-zA-Zßü]+ [a-zA-Zßü]+. \d+, \d+ [a-zA-Zßü ]+|[a-zA-Zßü -]+. \d+[\n]\d+ [a-zA-Zßü ]+|[a-zA-Zßü.-]+ \d+, \d+[ [a-zA-Zßü ]+/) : null;
//             })
//             /// getting all the cell ; 
//             const cell = await page.evaluate(() => {
//                 let text = document.querySelector('body')
//                 return text ? text.innerText.match(/[+] \d+ [(]\d+[)] \d+ \d+-\d+/) : null;
//             })

//             /// getting all the email
//             const email = await page.evaluate(() => {
//                 let text = document.querySelector('body');
//                 return text ? text.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/) : null;
//             });

//             /// getting all the applylinks
//             const applyLink = await page.evaluate(() => {
//                 return Array.from(document.querySelectorAll("#post-11306 > div > p:nth-child(14) > a:nth-child(14)")
//                 ).map(el => el.href)
//             })
//             const jobDetails = {
//                 title,
//                 location,
//                 cell,
//                 email,
//                 applyLink
//             }
//             allJobDetails.push(jobDetails);

//         }
//         await page.waitForTimeout(3000)
//         console.log(allJobDetails)
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

// stellenangobotOnline();







