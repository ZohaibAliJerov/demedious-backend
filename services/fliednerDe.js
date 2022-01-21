import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let zissedorf = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.fliedner.de/de/jobangebote.php", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("span.hl3 a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Fliedner Klinik Düsseldorf",
        link: "",
        level: "",
        position: "",
        city: "Düsseldorf",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("span.hl2");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector(".con-content.col-sm-8 col-xs-12")
        return loc ? loc.innerText.match(/[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+|[a-zA-Z-. ].+[\n]\d+ [a-zA-Z-.].+/) : '';
      });

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
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/);
      });
      if(typeof job.email == "object"){
        job.email = email[0]
      }
      // job.email = email

      // get link 
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector('.a-full-area')
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
zissedorf()
// export default zissedorf;

// import puppeteer from "puppeteer";

// let positions = ["arzt", "pflege"];
// let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

// let fliednerDe = async () => {
//   try {
//     let browser = await puppeteer.launch({
//       headless: false,
//     });

//     let page = await browser.newPage();

//     await page.goto("https://www.fliedner.de/de/jobangebote.php", {
//       waitUntil: "load",
//       timeout: 0,
//     });

//     await scroll(page);

//     //get all jobLinks
//     const jobLinks = await page.evaluate(() => {
//       return Array.from(
//         document.querySelectorAll("span.hl3 a")
//       ).map((el) => el.href);
//     });

//     console.log(jobLinks);
//     let allJobs = [];

//     for (let jobLink of jobLinks) {
//       let job = {
//         title: "",
//         location: "Düsseldorf",
//         hospital: "Fliedner Klinik Düsseldorf",
//         link: "",
//         level: "",
//         position: "",
//       };

//       await page.goto(jobLink, {
//         waitUntil: "load",
//         timeout: 0,
//       });

//       await page.waitForTimeout(1000);

//       let title = await page.evaluate(() => {
//         let ttitle = document.querySelector("span.hl2");
//         return ttitle ? ttitle.innerText : "";
//       });
//       job.title = title;

//       let text = await page.evaluate(() => {
//         return document.body.innerText;
//       });
//       //get level
//       let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
//       let position = text.match(/arzt|pflege/);
//       job.level = level ? level[0] : "";
//       if (
//         level == "Facharzt" ||
//         level == "Chefarzt" ||
//         level == "Assistenzarzt" ||
//         level == "Arzt" ||
//         level == "Oberarzt"
//       ) {
//         job.position = "artz";
//       }
//       if (position == "pflege" || (position == "Pflege" && !level in levels)) {
//         job.position = "pflege";
//         job.level = "Nicht angegeben";
//       }

//       if (!position in positions) {
//         continue;
//       }

//       //get link
//       let link = await page.evaluate(() => {
//         let applink = document.querySelector('.a-full-area')
//         return applink ? applink.href : " ";
//       });
      
//     job.link = link
//     allJobs.push(job);
//     }
//     console.log(allJobs);
//     await browser.close();
//     await page.close();
//     return allJobs.filter((job) => job.position != "");
//   } catch (e) {
//     console.log(e);
//   }
// };

// async function scroll(page) {
//   await page.evaluate(() => {
//     const distance = 100;
//     const delay = 100;
//     const timer = setInterval(() => {
//       document.scrollingElement.scrollBy(0, distance);
//       if (
//         document.scrollingElement.scrollTop + window.innerHeight >=
//         document.scrollingElement.scrollHeight
//       ) {
//         clearInterval(timer);
//       }
//     }, delay);
//   });
// }

// // fliednerDe()
// export default fliednerDe;
