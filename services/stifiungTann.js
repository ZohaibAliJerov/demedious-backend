
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let stifiungTan = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://stiftung-tannenhof-karriere.dvinci-easy.com/de/jobs", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);
    
    await page.waitForSelector('a.dvinci-job-position.ng-binding')
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("a.dvinci-job-position.ng-binding")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Evangelische Stiftung Tannenhof - Fachkrankenhaus für Psychiatrie, Psychotherapie, Psychosomatik und",
        link: "",
        level: "",
        position: "",
        city: "Remscheid",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".default-design-box h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

    //   job.location = await page.evaluate(() => {
    //     let loc = document.querySelector(".sidebar-widget").innerText;
    //     loc = loc.replace("\n", " ");
    //     return loc.replace(/\w+@\w+\.\w+/, "");
    //   });

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
    //   job.email = await page.evaluate(() => {
    //     return document.body.innerText.match(/\w+@\w+\.\w+/);
    //   });
    //   if (typeof job.email == "object") {
    //     job.email = job.email[0];
    //   }

      let link = page.evaluate(()=> {
          let Link = document.querySelector('.btn.btn-primary');
          return Link ? Link.href : ""
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
stifiungTan()
// export default aatalklinik;



// import puppeteer from "puppeteer";

// const stifiungTan = async () => {
//     try {
//         const browser = await puppeteer.launch({ headless: false });
//         const page = await browser.newPage();
//         page.setDefaultNavigationTimeout(0);

//         let allJobs = [];
//         let link = [,]

//         let counter = 0;
//         do {
//             await page.goto(link[counter], { timeout: 0 })
//             scroll(page);

//             //getting all the jobs links 


//             await page.waitForTimeout(3000)
//             await page.click('#headerStartPage > div > dvinci-layout > div > div > div:nth-child(2) > div.col-xs-12.col-sm-7.col-md-8.col-lg-9 > div.dvinci-job-list-pagination > a > span > span')
//             const jobs = await page.evaluate(() => {
//                 return Array.from(
//                     document.querySelectorAll('a.dvinci-job-position.ng-binding')
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
//             // await page.waitForSelector('h1')
//             const title = await page.evaluate(() => {
//                 let text = document.querySelector('h1')
//                 return text ? text.innerText : null;
//             });

//             /// getting all the cell no.
//             const cell = await page.evaluate(() => {
//                 let text = document.querySelector('.col-md-12');
//                 return text ? text.innerText.match(/\d+.\d+-\d+|[+]\d+ .\d+. \d+.-.\d+ \d+|[+]\d+ .\d+. \d+ \d+.-.\d+|[+]\d+ .\d+. \d+[-] \d+ - \d+|[+] .\d+. \d+ \d+ -\d+/) : null;
//             });

//             // getting all the links
//             const applyLink = await page.evaluate(() => {
//                 let link = document.querySelector('.btn.btn-primary')
//                 return link ? link.href : null;

//             })
//             // getting all the location from the links 
//             const location = await page.evaluate(() => {
//                 let text = document.querySelector('.portalFooter');
//                 return text ? text.innerText.match(/[a-zA-Z]+ [a-zA-Z. ]+\d+ [|] \d+ [a-zA-Z]+, [a-zA-Z]+|[a-zA-Z]+ [a-zA-Z.]+ \d+ [|] \d+ [a-zA-Z]+/) : null;
//             });

//             // /// getting all the emails 
//             const email = await page.evaluate(() => {
//                 let text = document.querySelector('.col-md-12');
//                 return text ? text.innerText.match(/[a-zA-Z.-]+[a-zA-Z]+@[a-zA-Z.-]+/) : null;
//             });


//             const jobDetails = {
//                 title,
//                 cell,
//                 applyLink,
//                 location,
//                 email

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

// stifiungTan();