import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let ptvSolingen = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    let alljobsLinks = [];
    let allLinks = ["https://ptv-solingen.de/blog/category/jobs/"]

    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      //get all job links
      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("h2.entry-title.fusion-post-title a")
        ).map((el) => el.href);
      });
      alljobsLinks.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks);
    //console.log(allJobs);

    console.log(alljobsLinks);

    let allJobs = [];

    for (let jobLink of alljobsLinks) {
      let job = {
        title: "",
        location: "Solingen",
        hospital: "Psychosoziale Trägerverein Solingen, Standort Eichenstraße",
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
        let ttitle = document.querySelector("h1.entry-title");
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
        let applyLink = document.querySelector('.post-content');
        return applyLink ? applyLink.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/): "";
      });
        job.link = link;
    
      // console.log(job);
      allJobs.push(job);
    }
    console.log(allJobs)
    await browser.close();
    await page.close()
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

ptvSolingen()
// export default aatalklinik;


// import puppeteer from "puppeteer";

// const ptvSolingen = async () => {
//     try {
//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0);

//         let allJobs = [];
//         let link = ["https://ptv-solingen.de/blog/category/jobs/"]

//         let counter = 0;
//         do {
//             await page.goto(link[counter], { timeout: 0 })
//             await scroll(page);



//             //getting all the jobs links 
//             const jobs = await page.evaluate(() => {
//                 return Array.from(
//                     document.querySelectorAll('h2 a')
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
//                 let text = document.querySelector('.clearfix');
//                 return text ? text.innerText.match(/[\d]+ . \d+ \d+ \d+|\d+[-/][\d-]+/) : null;
//             });

//             // getting all the location from the links 
//             const location = await page.evaluate(() => {
//                 let text = document.querySelector('body');
//                 return text ? text.innerText.match(/[a-zA-Zß]+ \d+-\d+[\n]\d+ [a-zA-Z]+/) : null;
//             });

//             /// getting all the emails 
//             const email = await page.evaluate(() => {
//                 let text = document.querySelector('.clearfix');
//                 return text ? text.innerText.match(/[a-zA-Z.-]+@[a-zA-Z.-]+/) : null;
//             });

//             // getting all the applylinks
//             const applyLink = await page.evaluate(() => {
//                 let text = document.querySelector('#post-7640 > div.post-content > div > div > div > div > div.fusion-text.fusion-text-5 > p:nth-child(8) > a');
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

// ptvSolingen();