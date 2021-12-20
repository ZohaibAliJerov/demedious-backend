import puppeteer from "puppeteer";
import {scroll} from "./pageScroll.js";

const stellenausschreibungen = async () =>{
          try {
            const browser = await puppeteer.launch({
                headless: false
                })
            const page = await browser.newPage();
           await page.goto(
               "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=16"
               )
            page.setDefaultNavigationTimeout(0);

            const jobLinks = [ ];
            let allUrls = [
                "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=16"
               ]
                // get all jobs links 
            for(let a = 0;a < allUrls.length; a++) {
               await page.goto(allUrls[a])
               scroll(page);
            let jobs = await page.evaluate( ()=>{
                return Array.from(document.querySelectorAll('.joboffer_title_text.joboffer_box > a')
                ).map((el) => el.href);
            })
            jobLinks.push(...jobs)
            }
            await page.waitForTimeout(3000);
            console.log(jobLinks);

            let allDetails = [ ];
    for(let details of jobLinks) {
        let job = { };
        scroll(page)
        await page.goto(details)

        let title = await page.evaluate ( () => {
            let title = document.querySelector('.scheme-content.scheme-title > h1')
            return title ? title.innerText : null
         })
         jobObject.title = title;
         let applyLink = await page.evaluate( () =>{
            let link = document.querySelector('#btn_online_application > a')
            return link ? link.href : null;
        })
       //  jobObject.link = applyLink
       if (typeof applyLink == "object" && email != null) {
           applyLink = applyLink[0];
         } else if (applyLink == null) {
          applyLink = " ";
         }
         jobObject.link = applyLink;
       
        
        
    
         await page.waitForTimeout(4000)
        allDetails.push(jobObject)
    }
  
        await browser.close();
        // await page.close();
        } catch (err) {
            console.error(err)
        }
    };

    let jobObject = { 
        title: "",
        location: "",
        hospital: "Katharina Kasper",
        link: "",
        level: "",
        position: "",
      };

