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

  
    }
   
        
   
        await browser.close();
        // await page.close();
        } catch (err) {
            console.error(err)
        }
    }