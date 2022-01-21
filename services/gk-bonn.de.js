
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let gk_bonn = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    
    
    let url = ["https://www.gk-bonn.de/gkbn/bildung-karriere/stellenboerse/?pageId29534281=1#list_29534",
            "https://www.gk-bonn.de/gkbn/bildung-karriere/stellenboerse/?pageId29534281=2#list_29534281"
        ]

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
                    document.querySelectorAll(".listEntryTitle  a")
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
        location: "",
        hospital: "Gemeinschaftskrankenhaus Bonn - Gesundheitszentrum St. Johannes Hospital",
        link: "",
        level: "",
        position: "",
        city: "Bonn",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
    
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".elementStandard.elementContent.elementHeadline h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
      
    

      job.location = await page.evaluate(() => {
        let loc = document.querySelector(".sectionInner")
        return loc ? loc.innerText.match(/[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+|[a-zA-Z-. ].+\d+ [a-zA-Z-.].+/) : 'Bonn';
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
      // get link 
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector('.onlineBewerben')
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
gk_bonn()


//       let title = await page.evaluate(() => {
//         let ttitle = document.querySelector(".elementStandard.elementContent.elementHeadline h1");
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
//         let applyLink = document.querySelector(".onlineBewerben");
//         return applyLink ? applyLink.href : ""
//       });
      
//         job.link = link

//       // console.log(job);
//       allJobs.push(job);
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

// // gk_bonn()
// export default gk_bonn;

