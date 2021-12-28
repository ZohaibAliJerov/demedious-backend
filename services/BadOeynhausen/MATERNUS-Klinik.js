
import puppeteer from "puppeteer";

let positions = [
    "arzt",
     "pflege"
    ];
let levels = [
    "Facharzt", 
    "Chefarzt", 
"Assistenzarzt"
 ];
 const klinikfur_Rehabilitation = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto(
           "https://www.wirpflegen.de/karriere/stellenangebote/ort/bad-oeynhausen/v/liste/j/city/nw-Bad%2520Oeynhausen?cHash=0efd8abceef8ff54a7feac73f84f1516#joResults"
           );
        page.setDefaultNavigationTimeout(0);
       
        const jobLinks = [ ];
        let allUrls = [
            "https://www.wirpflegen.de/karriere/stellenangebote/ort/bad-oeynhausen/v/liste/j/city/nw-Bad%2520Oeynhausen?cHash=0efd8abceef8ff54a7feac73f84f1516#joResults"
             ]
            // get all jobs links 
        for(let a=0;a<allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll(' div.item p > a')
            ).map((el) => el.href);
        })
        jobLinks.push(...jobs)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);

        const alljobDetails = [ ];
        for (let details of jobLinks) {
            await page.goto(details)
            let jobAds = {
                title: "",
                location: "Bad Oeynhausen",
                hospital: "MATERNUS-Klinik für Rehabilitation",
                link: "",
                level: "",
                position: "",
              };
             scroll(page)
         let title = await page.evaluate( () =>{
             let jobTitle = document.querySelector('div.content-area > h1');
             return jobTitle ? jobTitle.innerText : null
         })
         jobAds.title = title
         
         let applyLink = await page.evaluate( () =>{
             let link = document.querySelector('a.button-03')
             return link ? link.href : null
         })
         jobAds.link= applyLink;

         let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //get level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
          let position = text.match(/arzt|pflege/);
          jobAds.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt"
          ) {
            jobAds.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            jobAds.position = "pflege";
            jobAds.level = "Nicht angegeben";
          }
    
          if (!position in positions) {
            continue;
          }
          alljobDetails.push(jobAds)
          await page.waitForTimeout(4000)
        }
        console.log(alljobDetails);
        await browser.close();
        // await page.close();
        return alljobDetails.filter((job) => job.position != "");
      
    } catch (err) {
        console.error(err)
    }
}
export async function scroll(page) {
    await page.evaluate(() => {
        const distance = 100;
        const delay = 100;
        const timer = setInterval(() => {
            document.scrollingElement.scrollBy(0, distance);
            if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
                clearInterval(timer);
            }
        }, delay);
    });
}


