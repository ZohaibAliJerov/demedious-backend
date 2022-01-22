import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let gfo_kliniken = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.gfo-kliniken-troisdorf.de/arbeit-karriere/stellenangebote.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".gi.cell.breakword a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "GFO Kliniken Troisdorf, St. Johannes Krankenhaus",
        link: "",
        level: "",
        position: "",
        city: "Troisdorf",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
    //   let tit = 0;
    //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".pageHeadline > span");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
    //   }else{
    //     let title = await page.evaluate(() => {
    //       let ttitle = document.querySelector(".news-single-item h2");
    //       return ttitle ? ttitle.innerText : "";
    //     });
    //     job.title = title;
    //   }
    

      job.location = await page.evaluate(() => {
        let loc = document.querySelector(".siteFooter");
        return loc ? loc.innerText.match(/[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/) : ""
        
      });

      if(typeof job.location == 'object' && job.location != null ){
        job.location = job.location[0]
      }
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

      //get link\

      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/);
      });
      if(typeof job.email == "object" && job.email != null ){
        job.email = job.email[0]
      }
      // job.email = email

      // get link 
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector('a.onlinebewerben.btn.btn--invert')
          return applyLink ? applyLink.href : ""
        })
        job.link = link;
      } else {
        job.link = jobLink
      }



      allJobs.push(job);
    }
    console.log(allJobs)
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
gfo_kliniken()
// export default gfo_kliniken


// import puppeteer from 'puppeteer';

// const gfo_klinik_troisdorf = async () => {
//     try {

//         let browser = await puppeteer.launch({ headless: false });
//         let page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0)

//         let allJobs = [];
//         let link = [
//             
//         ];

//         let counter = 0;
//         do {
//             await page.goto(link[counter], { timeout: 0 });
//             await scroll(page);

//             const job = await page.evaluate(() => {
//                 let links = Array.from(document.querySelectorAll('.job-item.shuffle-item.shuffle-item--visible a')
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


//             await page.waitForSelector('.pageHeadline')
//             ///getting all the title from the links
//             const title = await page.evaluate(() => {
//                 let text = document.querySelector('.pageHeadline')
//                 return text ? text.innerText : null;
//             });


//             ///getting all the location

//             const location = await page.evaluate(() => {
//                 let text = document.querySelector('body');
//                 return text ? text.innerText.match(/[a-zA-Z-ß]+. \d+[\n]\d+ [a-zA-Z -]+|[a-zA-Zß.-]+ \d+. \d+ [a-zA-Zß-]+ [a-zA-Zß-]+|[a-zA-Zß-]+ \d+ [a-zA-Zß-]+ \d+ [a-zA-Zß -]+/) : null;
//             })
//             /// getting all the cell ; 
//             const cell = await page.evaluate(() => {
//                 let text = document.querySelector('body')
//                 return text ? text.innerText.match(/\d+[-/ ]\d+[ -]\d+|\d+ [/] \d+ \d+|\d+ \d+ -\d+/) : null;
//             })

//             /// getting all the email
//             const email = await page.evaluate(() => {
//                 let text = document.querySelector('body');
//                 return text ? text.innerText.match(/[a-zA-Z.]+[(][a-zA-Z-]+[)][a-zA-Z-.]+|[a-zA-Z.]+ [(][a-zA-Z-]+[)] [a-zA-Z-.]+|[(][a-zA-Z-]+[)] [a-zA-Z-.]+|[a-zA-Z.]+@[a-zA-Z-.]+/) : null;
//             });

//             /// getting all the applylinks
//             const applyLink = await page.evaluate(() => {
//                 let text = document.querySelector('.onlinebewerben.btn.btn--invert');
//                 return text ? text.href : null;
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

// gfo_klinik_troisdorf();







