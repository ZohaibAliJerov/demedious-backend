// import puppeteer from "puppeteer";

// let positions = ["arzt", "pflege"];
// let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

// const gk_bonn = async () => {
//   try {
//     let browser = await puppeteer.launch({ headless: false });
//     let page = await browser.newPage();

//     let url = [ "https://www.gk-bonn.de/gkbn/bildung-karriere/stellenboerse/?pageId29534281=1#list_29534",
//                 "https://www.gk-bonn.de/gkbn/bildung-karriere/stellenboerse/?pageId29534281=2#list_29534281"
//             ]

//             let allJobLinks  = []
//             let counter = 0
//             do {

//                 await page.goto(url, {
//                     waitUntil: "load",
//                     timeout: 0,
//                   });
//                 //wait for a while
//         await page.waitForTimeout(3000);

//       //scroll the page
//       await scroll(page)
        
//       //get all jobLinks
//       let jobLinks = await page.evaluate(() => {
//         return Array.from(
//           document.querySelectorAll(".listEntryTitle  a")
//         ).map((el) => el.href);
//       });
//       allJobLinks.push(jobLinks)
//       counter++;
     
//     } while (counter > jobLinks.length);
//     console.log(allJobLinks);
    

//     //end of while loop
//     let allJobs = [];

//     //visit each job link
//     for (let jobLink of allJobLinks) {
    
//         let job = {
//           title: "",
//           location: "Düsseldorf",
//           hospital: "Klinik für Psychiatrie und",
//           link: "",
//           level: "",
//           position: "",
//         };
//         await page.goto(jobLink, { timeout: 0, waitUntil: "load" });


//         //scroll the page
//         await scroll(page);
//         //get title
//         job.title = await page.evaluate(() => {
//           let ttitle = document.querySelector(".elementStandard.elementContent.elementHeadline h1")
//           return ttitle ?  ttitle.innerText : "";
//         });
//         let text = await page.evaluate(() => {
//           return document.body.innerText;
//         });
//         //get level
//         let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
//         let position = text.match(/arzt|pflege/);
//         job.level = level ? level[0] : "";
//         if (
//           level == "Facharzt" ||
//           level == "Chefarzt" ||
//           level == "Assistenzarzt" ||
//           level == "Arzt" ||
//           level == "Oberarzt"
//         ) {
//           job.position = "artz";
//         }
//         if (
//           position == "pflege" ||
//           (position == "Pflege" && !level in levels)
//         ) {
//           job.position = "pflege";
//           job.level = "Nicht angegeben";
//         }

//         if (!position in positions) {
//           continue;
//         }

//         //get applyLink
//         const link  = await page.evaluate(() => {
//           let applyLink =  document.querySelector(".onlineBewerben")
//           return applyLink ? applyLink.href : " ";
//         });
//         allJobs.push(link, job);
//         console.log(allJobs)
//         await browser.close()
//         await page.close();
//         console.log(allJobLinks)
//       }
//         return allJobs;
//   }catch (error) {
//     console.log(error);
//   }
// }

// async function scroll(page) {
//     await page.evaluate(() => {
//       const distance = 100;
//       const delay = 100;
//       const timer = setInterval(() => {
//         document.scrollingElement.scrollBy(0, distance);
//         if (
//           document.scrollingElement.scrollTop + window.innerHeight >=
//           document.scrollingElement.scrollHeight
//         ) {
//           clearInterval(timer);
//         }
//       }, delay);
//     });
//   }

//   gk_bonn()
//export default recruiting;




