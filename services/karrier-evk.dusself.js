
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let ugos_de = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    await page.goto('https://www.karriere-evk-duesseldorf.de/', {
      waitUntil : "load",
      timeout : 0
    })
    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
      //scroll the page
      await scroll(page)
      //get all jobLinks
      // await page.waitForSelector(".layout_teaser.block.last.even > h2 > a")
     
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(".layout_teaser.block.last.even > h2 a")
        ).map((el) => el.href);
      });
      allJobLinks.push(...jobLinks);
      await page.waitForTimeout(3000);
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector("#article-1711 > div > div.mod_ng_bwm_liste.block > nav > ul > li.next > a");
      });
      if (bottomNextLink) {
        await page.click("#article-1711 > div > div.mod_ng_bwm_liste.block > nav > ul > li.next > a");
        nextPage = true;
      } else {
        nextPage = false;
      }
    }
    console.log(allJobLinks)
    let allJobs = [];

    for (let jobLink of allJobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Gräfliche Kliniken - Caspar Heinrich Klinik",
        link: "",
        level: "",
        position: "",
        city: "Bad Driburg",
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
          let ttitle = document.querySelector("h1.title");
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
        return  document.body.innerText.match(/[a-zA-Z-.ßöü ]+ \d+[\n][\n]\d+[a-zA-Z-.ßöü ]+|[a-zA-Z-.ßöü ]+ \d+[\n]\d+[a-zA-Z-. ßöü]+|[a-zA-Z-.ßöü]+ \d+ . \d+ [a-zA-Z-.ßöü]+/) || ""
        
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
          let applyLink = document.querySelector('.online-bewerben.link ax`')
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
ugos_de()
// export default ugos_de




// import puppeteer from "puppeteer";

// let positions = ["arzt", "pflege"];
// let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

// let karrier_evk_dus = async () => {
//   try {
//     let browser = await puppeteer.launch({
//       headless: false,
//     });

//     let page = await browser.newPage();

//     await page.goto("https://www.karriere-evk-duesseldorf.de/aerztlicher-dienst.html", {
//       waitUntil: "load",
//       timeout: 0,
//     });

//     await scroll(page);

//     //get all jobLinks
//     const jobLinks = await page.evaluate(() => {
//       return Array.from(
//         document.querySelectorAll("h2 a ")
//       ).map((el) => el.href);
//     });

//     console.log(jobLinks);
//     let allJobs = [];

//     for (let jobLink of jobLinks) {
//       let job = {
//         title: "",
//         location: "Düsseldorf",
//         hospital: "Evangelisches Krankenhaus Düsseldorf",
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
//         let ttitle = document.querySelector("h1.title");
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
//         let appLink = document.querySelector("p.online-bewerben.link a")
//         return appLink ? appLink.href : " ";
//       });
      
//       job.link = link
//       allJobs.push(job);
//     }
//     console.log(allJobs)
//     await page.close();
//     await browser.close();
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

// karrier_evk_dus();
