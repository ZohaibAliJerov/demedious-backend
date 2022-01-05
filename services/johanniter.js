



import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let johanniter = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
            let jobLinks = []
            let allLinks = [
            "https://www.johanniter.de/johanniter-kliniken/neurologisches-rehabilitationszentrum-godeshoehe/karriere/"
            ]
            let counter = 0;
            do {
                await page.goto(allLinks[counter], { timeout: 0 })
                
               await scroll(page)
             
                
                // getting all the links 
                const links = await page.evaluate(() => {
                    return Array.from(
                        document.querySelectorAll('.c-content-list__text > h3 a' )
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
        location: "Mönchengladbach",
        hospital: "Evangelisches Krankenhaus Bethesda Mönchengladbach",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await scroll(page)

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".c-page-title > h1");
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
       let applink = document.querySelector('a.c-button.c-button--main.c-button--large');
       return applink ? applink.href : null;
    });
      // if (typeof link == "object") {
      //   job.link = link;
      // }
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

johanniter()







// import puppeteer from "puppeteer";

// const johanniter = async () => {
//   try {
//     let browser = await puppeteer.launch({ headless: true });
//     let page = await browser.newPage();
//     let url =
//       "https://www.johanniter.de/johanniter-kliniken/neurologisches-rehabilitationszentrum-godeshoehe/karriere/";

//     await page.goto(url, { timeout: 0, waitUntil: "load" });
//     await page.waitForTimeout(3000);
//     //remove the dialog box
//     await page.waitForSelector("#uc-btn-accept-banner");
//     await page.click("#uc-btn-accept-banner");

//     await page.waitForTimeout(1000);
//     //scroll the page
//     await page.evaluate(() => {
//       for (let i = 0; i < 100; i++) {
//         if (
//           document.scrollingElement.scrollTop + window.innerHeight >=
//           document.scrollingElement.scrollHeight
//         ) {
//           break;
//         }
//         document.scrollingElement.scrollBy(0, 100);
//         setTimeout(10000);
//       }
//     });
//     //get all pages
//     let pages = await page.evaluate(() => {
//       return Array.from(
//         document.querySelectorAll(".c-pagination__list > li > a")
//       ).map((el) => el.href);
//     });

//     //get all job links
//     let allJobLinks = [];
//     for (let pg of pages) {
//       //visit each page
//       await page.goto(`${pg}`, { timeout: 0, waitUntil: "load" });
//       //scroll the each page
//       //scroll the page
//       await page.evaluate(() => {
//         for (let i = 0; i < 100; i++) {
//           if (
//             document.scrollingElement.scrollTop + window.innerHeight >=
//             document.scrollingElement.scrollHeight
//           ) {
//             break;
//           }
//           document.scrollingElement.scrollBy(0, 100);

//           setTimeout(1000);
//         }
//       });

//       let jobLinks = await page.evaluate(() => {
//         return Array.from(
//           document.querySelectorAll("div.c-content-list__text > h3 > a")
//         ).map((el) => el.href);
//       });
//       allJobLinks.push(...jobLinks);
//     }

//     // get all job details
//     let allJobs = [];
//     //visit all job links
//     for (let link of allJobLinks) {
//       await page.goto(link, { waitUntil: "load", timeout: 0 });
//       await page.waitForTimeout(3000);
//       //scroll the page
//       await page.evaluate(() => {
//         for (let i = 0; i < 100; i++) {
//           if (
//             document.scrollingElement.scrollTop + window.innerHeight >=
//             document.scrollingElement.scrollHeight
//           ) {
//             break;
//           }
//           document.scrollingElement.scrollBy(0, 100);
//           setTimeout(1000);
//         }
//       });
//       let title = await page.evaluate(() => {
//         return document.querySelector("h1").innerText;
//       });

//       let location = await page.evaluate(() => {
//         return document.querySelector(".c-inline-list__list  > li").innerText;
//       });

//       let cell = await page.evaluate(() => {
//         return document.body.innerText.match(/\d+\s\d+-\d+/);
//       });
//       if (typeof cell == "object" && cell != null) {
//         cell = cell[0];
//       } else if (cell == null) {
//         cell = "";
//       }
//       let email = await page.evaluate(() => {
//         return document.body.innerText.match(/\w+@\w+\.\w+/);
//       });
//       if (typeof email == "object" && email != null) {
//         email = email[0];
//       } else if (email == null) {
//         email = "";
//       }
//       let applyLink = email;

//       allJobs.push({ title, location, cell, email, applyLink });
//     }
//     await page.close();
//     await browser.close();
//     return allJobs;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default johanniter;
