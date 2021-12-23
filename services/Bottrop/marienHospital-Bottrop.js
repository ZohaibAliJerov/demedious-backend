import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];
const hospitalOfDuisburg_Essen = async () => {
    try {
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage();
       await page.goto("http://www.mhb-bottrop.de/wirueberuns/stellenangebote/Seiten/default.aspx");
       page.setDefaultNavigationTimeout(0);
       const jobLinks = [ ];
        let allUrls = [
            "http://www.mhb-bottrop.de/wirueberuns/stellenangebote/Seiten/default.aspx"
        ];
        for(let a=0;a<allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let job = await page.evaluate( ()=>{
            return   Array.from(document.querySelectorAll('div.item.stellenanzeige > a')
            ).map((el) => el.href);
        })
        jobLinks.push(...job)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);
          
        const jobDetails = [ ];
        for (let url of jobLinks) {
            await page.goto(url)
            scroll(page);
            let newJob = {
                title: "",
               location: "Bottrop",
               hospital: "Marienhospital Bottrop",
               link: "",
               level: "",
               position: "",
               };
            // page.waitForSelector(".accordion-title")
            const title = await page.evaluate( () => {
                let jobTitle = document.querySelector('div.ms-rteElement-Headcontent')
                return jobTitle ? jobTitle.innerText : null
            })
            newJob.title = title;
            let text = await page.evaluate(() => {
                return document.body.innerText;
              });
              //level
              let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
              let position = text.match(/arzt|pflege/);
              newJob.level = level ? level[0] : "";
              if (
                level == "Facharzt" ||
                level == "Chefarzt" ||
                level == "Assistenzarzt"
              ) {
                newJob.position = "artz";
              }
              if (position == "pflege" || (position == "Pflege" && !level in levels)) {
                newJob.position = "pflege";
                newJob.level = "Nicht angegeben";
              }
        
              if (!position in positions) {
                continue;
              };

              let link = await page.evaluate(() => {
                return document.body.innerText.match(/\w+.@\w+-\w+\.\w+/g);
              });
              if (typeof link == "object") {
                newJob.link = link;
              }
            await page.waitForTimeout(4000);
            jobDetails.push(newJob)
        }
        console.log(jobDetails);

     await browser.close()
    //    await page.close()
    return jobDetails.filter((job) => job.position != "");

        
    } catch (err) {
        console.error(err);
    }
}


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
  };


  export default hospitalOfDuisburg_Essen;
