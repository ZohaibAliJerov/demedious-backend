import puppeteer from "puppeteer";
import {scroll} from "./pageScroll.js";

let positions = ["arzt", "pflege"];
let levels = [
    "Facharzt", 
    "Chefarzt", 
"Assistenzarzt"
 ];
const luisenHospital_Aachen = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto(
           "https://stellen.luisenhospital.de/stellenangebote.html"
           );
        page.setDefaultNavigationTimeout(0);
       
        const jobLinks = [ ];
        let allUrls = [
            "https://stellen.luisenhospital.de/stellenangebote.html"
        ]
            // get all jobs links 
        for(let a=0;a<allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let job = await page.evaluate( ()=>{
            return Array.from(document.querySelectorAll('div.joboffer_title_text.joboffer_box > a'))
            .map((el) => el.href);
        })
        jobLinks.push(...job)
        }
        console.log(jobLinks);
        await page.waitForTimeout(3000);

        const alljobDetails = [ ];
        for (let details of jobLinks) {
            await page.goto(details)
            scroll(page)
            let jobs = {
                title: "",
               location: "Aachen ",
               hospital: "Luisenhospital Aachen ",
               link: "",
               level: "",
               position: "",
               };
            let title = await page.evaluate( () =>{
                let jobTitle = document.querySelector('div.scheme-content.scheme-title h1');
                return jobTitle ? jobTitle.innerText : null
            })
            jobs.title = title;
           
            let applyLink = await page.evaluate( () => {
                let link = document.querySelector('div#btn_online_application > a');
                return link ? link.href : null
            })
            jobs.link = applyLink;
      
            let text = await page.evaluate(() => {
                return document.body.innerText;
              });
              //level
              let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
              let position = text.match(/arzt|pflege/);
              jobs.level = level ? level[0] : "";
              if (
                level == "Facharzt" ||
                level == "Chefarzt" ||
                level == "Assistenzarzt"
              ) {
                jobs.position = "artz";
              }
              if (position == "pflege" || (position == "Pflege" && !level in levels)) {
                jobs.position = "pflege";
                jobs.level = "Nicht angegeben";
              }
        
              if (!position in positions) {
                continue;
              };
            alljobDetails.push(jobs)
        }
        console.log(alljobDetails);
        await browser.close();
        // await page.close();
        return alljobDetails.filter((job) => job.position != "");

    } catch (err) {
        console.error(err)
    }
}

