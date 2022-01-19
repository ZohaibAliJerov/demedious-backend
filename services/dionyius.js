import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];


let dionyius = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto("https://www.dionysius-walsum.de/fachklinik-st-camillus/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);
    //           let jobLinks = await page.evaluate(() => {
    //             return Array.from(
    //                 document.querySelectorAll('.jotitle > p a')
    //             ).map(el => el.href)
    //           });
    // console.log(jobLinks);
    // await page.waitForTimeout(3000);

    let allJobs = [];

    // for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Duisburg",
        hospital: "Fachklinik St. Camillus",
        link: "",
        level: "",
        position: "",
      };
    //   await page.goto(jobLink, {
    //     waitUntil: "load",
    //     timeout: 0,
    //   });

      await page.waitForTimeout(1000);
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".et_pb_text_inner h1");
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
        console.log('ok')
      }
      //get link
      let link = await page.evaluate(() => {
          let links = document.querySelector(".et_pb_text_inner")
        // document.querySelector('.btn.btn-primary');         
        return links ? links.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/) : "";
      })
      job.link = link
      allJobs.push(job);
    
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
      ){
          clearInterval(timer)
      }
    }, delay)
});
}
dionyius()


// import puppeteer from "puppeteer";

// const kalkon = async () => {
//     try {
//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0);

//         let allJobs = ["https://www.dionysius-walsum.de/fachklinik-st-camillus/"];

     
//         const allJobDetails = []

//         for (const url of allJobs) {
//             await page.goto(url)
            
//             await scroll(page)
//             /// getting all the title

//             const title = await page.evaluate(() => {
//                 let text = document.querySelector('h1')
//                 return text ? text.innerText : null;
//             })

//             /// getting all the cell no.
//             const cell = await page.evaluate(() => {
//                 let text = document.querySelector('body');
//                 return text ? text.innerText.match(/\d+ . \d+ \d+ \d+/) : null;
//             });

//             // getting all the location from the links 
//             const location = await page.evaluate(() => {
//                 let text = document.querySelector('body');
//                 return text ? text.innerText.match(/[a-zA-Z. ]+\d+[\n]\d+ [a-zA-Z. ,]+/) : null;
//             });

//             /// getting all the emails 
//             const email = await page.evaluate(() => {
//                 let text = document.querySelector('body');
//                 return text ? text.innerText.match(/[a-zA-Z. ]+@[a-zA-Z-.]+/) : null;
//             });

//             // getting all the applylinks
//             const applyLink = await page.evaluate(() => {
//                 let text = document.querySelector('#et-boc > div > div > div > div > div > div > div > p:nth-child(7) > a:nth-child(1)');
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

// kalkon();