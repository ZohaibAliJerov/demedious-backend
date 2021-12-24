import { l } from "node-apidoc";
import puppeteer from "puppeteer";


const lukasKrankenhaus_Bünde = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto("https://www.lukas-krankenhaus.de/de/unser-haus/index-stellenangebote.php")
        page.setDefaultNavigationTimeout(0);

        const jobLinks = [ ];
        let allUrls = [
            "https://www.lukas-krankenhaus.de/de/unser-haus/index-stellenangebote.php"
        ]
            // all jobsLinks 
        for(let a=0;a<allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let job = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('.listEntryInner > h3 > a')
            ).map((el) => el.href);
        })
        jobLinks.push(...job)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);
        
        const jobsDetails = [ ];
        for (let link of jobLinks) {
            await page.goto(link);
            scroll(page);
         let details =  {
            title: "",
           location: "Bünde",
           hospital: "Lukas-Krankenhaus Bünde",
           link: "",
           level: "",
           position: "",
           };
         let title = await page.evaluate( () =>{
             let jbTitle = document.querySelector('div.elementStandard.elementContent.elementHeadline.elementHeadline_var0 > h2');
             return jbTitle ? jbTitle.innerText : null;
         })
         details.title = title;
         let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
          let position = text.match(/arzt|pflege/);
          details.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt"
          ) {
            details.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            details.position = "pflege";
            details.level = "Nicht angegeben";
          }
    
          if (!position in positions) {
            continue;
          };
           
           let applyLink = await page.evaluate( () =>{
               let links = document.querySelector('a.intern');
               return links ? links.href : null
           })
           details.link = applyLink;

         await page.waitForTimeout(4000)
         jobsDetails.push(details)
        }
        console.log(jobsDetails);

        await browser.close();
        // await page.close();
        return jobsDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err)
    }
};
let positions = ["arzt", "pflege"];
let levels = [
    "Facharzt", 
    "Chefarzt", 
"Assistenzarzt"
 ];
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


export default lukasKrankenhaus_Bünde;