
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let Karrer_evkb = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    let allJobsLinks = []
    let allLinks = [
      "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/",
      "https://www.johanniter.de/jo hanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=2&cHash=7ea1ac21af90d15dc61fea4a1e1fcc7b",
      "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=3&cHash=29fa0d4566af249941be02c6837d67f1",
      "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=4&cHash=f4952cb1f467cf5ff54d3dba6509eac5",
      "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=5&cHash=f2c3f31c88e41918566b7e8251f53c3b",
    ];

    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      // get all job links
      const jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll('.c-content-list__text > h3 > a')
        ).map((el) => el.href);
      });
      console.log(jobLinks);
      allJobsLinks.push(...jobLinks);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    console.log(allJobsLinks);


    let allJobs = [];

    for (let jobLink of allJobsLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Evangelisches Klinikum Bethel",
        link: "",
        level: "",
        position: "",
        city: "Mönchengladbach",
        email: "",
        republic: "North Rhine-Westphalia",
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

      const location = await page.evaluate(() => {
        let text = document.querySelector(".o-grid__row");
        return text ? text.innerText.match(
          /[a-zA-Z0-9]+ [a-zA-Z0-9]+[\n\][a-zA-Z0-9]+ [a-zA-Z0-9]+ \d+[\n][\n]\d+ [a-zA-Z0-9]+/
        )
          : null;
      });
      job.location = location

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
      let email = await page.evaluate(() => {
        let text = document.querySelector("div.o-grid__row");
        return text ? text.innerText.match(
            /[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/
          )
          : null;
      });

      job.email = email

      //   getting applylink
      let link = page.evaluate(() => {
        let Link = document.querySelector('a.c-button.c-button--main.c-button--large');
        return Link ? Link.href : "";
      })
      job.link = link
      //   job.link = jobLink;

      allJobs.push(job);
    }
    console.log(allJobs);
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

Karrer_evkb()
// export default Karrer_evkb;





// import puppeteer from "puppeteer";

// const johanneiter = async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     page.setDefaultNavigationTimeout(0);
//     //scroll the page
//     let allJobs = [];
//     let allLinks = [
//       "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/",
//       "https://www.johanniter.de/jo hanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=2&cHash=7ea1ac21af90d15dc61fea4a1e1fcc7b",
//       "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=3&cHash=29fa0d4566af249941be02c6837d67f1",
//       "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=4&cHash=f4952cb1f467cf5ff54d3dba6509eac5",
//       "https://www.johanniter.de/johanniter-kliniken/johanniter-klinik-am-rombergpark-dortmund/karriere/?page=5&cHash=f2c3f31c88e41918566b7e8251f53c3b",
//     ];

//     let counter = 0;
//     do {
//       await page.goto(allLinks[counter], { timeout: 0 });
//       scroll(page);
//       //  get all job links
//       let jobs = await page.evaluate(() => {
//         return Array.from(
//           document.querySelectorAll(".c-content-list__text > h3 > a")
//         ).map((el) => el.href);
//       });
//       console.log(jobs);
//       allJobs.push(...jobs);
//       counter++;
//       await page.waitForTimeout(3000);
//     } while (counter < allLinks.length);
//     console.log(allJobs.length);
//     let allJobDetails = [];
//     // get data from every job post
//     for (const url of allJobs) {
//       await page.goto(url);
//       scroll(page);

//       await page.waitForSelector("h1");
//       const title = await page.evaluate(() => {
//         return document.querySelector("h1").innerText || null;
//       });

//       //   get contacts
//       await page.waitForSelector("a.c-link.u-icon.u-icon.u-icon--phone");
//       let cell = await page.evaluate(() => {
//         let num = document.querySelector(
//           "a.c-link.u-icon.u-icon.u-icon--phone"
//         );
//         return num ? num.href : null;
//       });
//       // get email
//       await page.waitForSelector("div.o-grid__row");
//       let email = await page.evaluate(() => {
//         let text = document.querySelector("div.o-grid__row");
//         return text
//           ? text.innerText.match(
//               /[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+-[a-zA-Z0-9]+.[a-zA-Z0-9]+/g
//             )
//           : null;
//       });

//       // get address
//       let location = await page.evaluate(() => {
//         let text = document.querySelector(".o-grid__row");

//         return text
//           ? text.innerText.match(
//               /[a-zA-Z0-9]+ [a-zA-Z0-9]+[\n\][a-zA-Z0-9]+ [a-zA-Z0-9]+ \d+[\n][\n]\d+ [a-zA-Z0-9]+/
//             )
//           : null;
//       });
//       let applyLink = await page.evaluate(() => {
//         let text = document.querySelector(
//           "a.c-button.c-button--main.c-button--large"
//         );
//         return text ? text.href : null;
//       });
//       const jobDetails = {
//         title,
//         cell,
//         email,
//         location,
//         applyLink,
//       };
//       allJobDetails.push(jobDetails);
//       await page.waitForTimeout(3000);
//     }
//     console.log(allJobDetails);
//     await page.close();
//     return allJobDetails;
//   } catch (err) {
//     console.log(err);
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

// export default johanneiter;
