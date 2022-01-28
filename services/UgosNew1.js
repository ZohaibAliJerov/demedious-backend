

import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let ugos_de = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    let url = ["https://www.ugos.de/karriere/park-klinik?id=2066&tx_kesearch_pi1%5Bpage%5D=1&tx_kesearch_pi1%5BresetFilters%5D=0&tx_kesearch_pi1%5BsortByField%5D=&tx_kesearch_pi1%5BsortByDir%5D=&tx_kesearch_pi1%5Bfilter%5D%5B1%5D=&tx_kesearch_pi1%5Bfilter%5D%5B2%5D=Bad-Hermannsborn&tx_kesearch_pi1%5Bfilter%5D%5B3%5D="]
            
            
            let nextPage = true;
            let allJobLinks = []
            let counter = 0
            do {
                await page.goto(url[counter], {
                    waitUntil: "load",
                    timeout: 0,
                });
                //wait for a while
                await page.waitForTimeout(1000);
                await scroll(page)
                //get all jobLinks
                let jobLinks = await page.evaluate(() => {
                    return Array.from(
                        document.querySelectorAll(".articletype-0.jobs > h3 a")
                    ).map((el) => el.href);
                });
                let bottomNextLink = await page.evaluate(() => {
                  return document.querySelector("#news-container-18962 > div:nth-child(13) > ul > li.last.next > a");
                });
                if (bottomNextLink) {
                  await page.click("#news-container-18962 > div:nth-child(13) > ul > li.last.next > a");
                  nextPage = true;
                } else {
                  nextPage = false;
                }
                allJobLinks.push(...jobLinks)
                counter++;
    
            } while (counter < url.length);
            console.log(allJobLinks);
    
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
          let ttitle = document.querySelector(".article h1");
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
        let loc = document.querySelector("#c18736");
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
      // let link1 = 0;
      // if (link1) {
      //   const link = await page.evaluate(() => {
      //     let applyLink = document.querySelector('a.onlinebewerben.btn.btn--invert')
      //     return applyLink ? applyLink.href : ""
      //   })
      //   job.link = link;
      // } else {
        job.link = jobLink
      // }



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

export default ugos_de;



