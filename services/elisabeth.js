
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let elisabeth = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
            let jobLinks = []
            let allLinks = [
              "https://elisabeth-klinik.de/elisabeth-klinik/jobs-karriere/stellenmarkt/"
            ]
            let counter = 0;
            do {
                await page.goto(allLinks[counter], { timeout: 0 })
                scroll(page)
                
                // getting all the links 
                const links = await page.evaluate(() => {
                    return Array.from(
                        document.querySelectorAll('tbody a' )
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
        location: "Olsberg",
        hospital: "Elisabeth-Klinik Bigge",
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
        let ttitle = document.querySelector("section h1");
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
       let applink = document.querySelector('.cr.button a');
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

elisabeth()


// import puppeteer from "puppeteer";

// const elisabeth = async () => {
//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//     const page = await browser.newPage();
//     await page.goto(
//       "https://www.elisabethgruppe.de/untermenue/karriere-bildung/jobportal-stellenangebote.html",
//       {
//         waitUntil: "load",
//         timeout: 0,
//       }
//     );

//     //shutt the dialog
//     await page.waitForSelector(
//       "button#uc-btn-accept-banner.uc-btn-new.uc-btn-new.uc-btn-accept"
//     );
//     await page.click(
//       "button#uc-btn-accept-banner.uc-btn-new.uc-btn-new.uc-btn-accept"
//     );
//     await page.waitForTimeout(5000);

//     let allPageLinks = [];

//     let pages = await page.evaluate(() => {
//       let links = Array.from(document.querySelectorAll("div.liste_seiten > a"));
//       links = links.map((el) => {
//         return el.href;
//       });
//       return links;
//     });
//     //    console.log(pages);
//     pages = pages.slice(1, pages.length);
//     allPageLinks.push(...pages);

//     //    console.log(allPageLinks);

//     let allJobLinks = [];
//     //get all joblinks
//     for (let pageLink of allPageLinks) {
//       //visit each page
//       await page.goto(pageLink, {
//         waitUntil: "load",
//         timeout: 0,
//       });

//       //scroll down
//       await scroll(page);

//       //select jobs and take urls
//       let JobLinks = await page.evaluate(() => {
//         return [
//           ...document.querySelectorAll("span.headerlink.stellenlink > a"),
//         ].map((job) => job.href);
//       });
//       allJobLinks.push(...JobLinks);
//       await page.waitForTimeout(3000);
//     }
//     //    console.log(allJobLinks);
//     let allJobs = [];
//     for (let jobLink of allJobLinks) {
//       //visit each job link
//       await page.goto(jobLink, { waitUntil: "load", timeout: 0 });
//       //   await page.waitForTimeout(1000);

//       scroll(page);
//       await page.waitForTimeout(5000);
//       let newJob = {};

//       //get title

//       let title = await page.evaluate(() => {
//         let selector1 = document.querySelector("div#con_1 > font > font");
//         let selector2 = document.querySelector("div#con_1");

//         return selector1?.innerText || selector2?.innerText;
//       });
//       newJob.title = title;

//       //get address
//       await page.waitForSelector("div#con_2 > div");
//       let address = await page.evaluate(() => {
//         let adrs = document.querySelector("div#con_2 > div");
//         return adrs ? adrs.innerText : null;
//       });
//       newJob.address = address;

//       //get email
//       // email is not available
//       newJob.email = null;

//       //get cell
//       let cell = await page.evaluate(() => {
//         let cellNo = document.querySelector("div#con_38 > div");
//         return cellNo
//           ? cellNo.innerText.match(/\d+.-.\d+-\d+|\d+.-.\d+.-.\d+/)
//           : null;
//       });

//       newJob.cell = cell;

//       await page.waitForSelector("span#probew > a");
//       let applyLink = await page.evaluate(() => {
//         let link = document.querySelector("span#probew > a ");
//         return link ? link.href : null;
//       });
//       newJob.applyLink = applyLink;

//       allJobs.push(newJob);
//     }

//     console.log(allJobs);
//     await browser.close();
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

// export default elisabeth;
