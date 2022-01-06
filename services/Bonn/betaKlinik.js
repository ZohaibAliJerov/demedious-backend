import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", 
"Arzt", "Oberarzt"];
const betaKlinik = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto(
           "https://www.betaklinik.de/beta-klinik/stellenangebote/"
           )
        page.setDefaultNavigationTimeout(0);
        const jobLinks = [ ];
        let allUrls = [
            "https://www.betaklinik.de/beta-klinik/stellenangebote/"
        ]
            // get all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            let links = Array.from(document.querySelectorAll('a.vc_general.vc_btn3.vc_btn3-size-md.vc_btn3-shape-square.vc_btn3-style-flat.vc_btn3-color-warning')
            ).map((el) => el.href);
        let links1 = Array.from(document.querySelectorAll('.vc_custom_heading.vc_custom_1562575030398.vc_gitem-post-data.vc_gitem-post-data-source-post_title > h3 > a')
        ).map((el) => el.href);
           return links || links1;
        })
        jobLinks.push(...jobs)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);
    
        const jobs = [ ];
        for (let url of jobLinks) {
           let detail = {
            title: "",
            location: "Bonn",
            hospital: "Beta Klinik",
            link: "",
            level: "",
            position: "",
          };
           scroll(page);
           await page.goto(url)
           let title = await page.evaluate( () =>{
               let jobTitle = document.querySelector('#content > h1')
               return jobTitle ? jobTitle.innerText : null
           })
           detail.title = title;

           let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //get level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
          let position = text.match(/arzt|pflege/);
          detail.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt" ||
            level == "Arzt" ||
            level == "Oberarzt"
          ) {
            detail.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            detail.position = "pflege";
            detail.level = "Nicht angegeben";
          }
    
          if (!position in positions) {
            continue;
          }
    
          //get link
          let link = await page.evaluate(() => {
            return document.body.innerText.match(/[A_Za-z0-9._+/-]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
          });
          if (typeof link == "object") {
            detail.link = link;
          }
           await page.waitForTimeout(4000);
           jobs.push(detail)
        } 
        console.log(jobs);
        
       
        await browser.close();
        // await page.close();
        return jobs.filter((job) => job.position != "");
    } catch (err) {
        console.error(err)
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
  }


