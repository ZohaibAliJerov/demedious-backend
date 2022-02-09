import puppeteer from "puppeteer";
import {scroll} from "./pageScroll.js";

const medical_Park= async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto(
           "https://karriere.medicalpark.de/de/Stellenangebote"
           )
        // page.setDefaultNavigationTimeout(0);

        const jobLinks = [ ];
        let allUrls = [
            "https://karriere.medicalpark.de/de/Stellenangebote?page=1#",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=2",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=3",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=4",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=5",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=6",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=7",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=8",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=9",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=10",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=11",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=12",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=13",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=14",
            "https://karriere.medicalpark.de/de/Stellenangebote?page=15#"
             ]
            // get all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('div.inner > a')
            ).map((el) => el.href);
        })
        jobLinks.push(...jobs)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);
        // await page.waitForTimeout(4000);

        const medicalJobs = [ ];
        for (let details of jobLinks) {
            await page.goto(details);
            let jobsDetails = [ ];
            scroll(page);
          let title = await page.evaluate( () =>{
              let jobTitle = document.querySelector('div.col-lg-9.col-md-8.col-sm-7.job-content > h2');
              return jobTitle ? jobTitle.innerText : null;
          })
          jobsDetails.title = title;
           let email = await page.evaluate( () =>{
               let mail = document.querySelector('div#site-wrapper');
               return mail ? mail.innerText.match(/[a-zA-z0-9_+-./]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+/g) : null
           })
           jobsDetails.email = email;
           let cell = await page.evaluate( () =>{
            let contact = document.querySelector('div#site-wrapper')
            return contact ? contact.innerText.match(/\+\d+.[ /-]\d+.[ -/]\d+.[ -/]\d+/g) : null
        })
        jobsDetails.cell = cell;
        let location = await page.evaluate( () =>{
            let loc = document.querySelector('div#site-wrapper');
            return loc ? loc.innerText.match(/[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.\n?.[A-Za-z0-9]+.[ A-Za-z0-9]+.[a-z]\n.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+.?[a-z0-9]\n.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9]+./g) : null
        })
        jobsDetails.location = location;
        let applyLink = await page.evaluate( () =>{
            let link1 = document.querySelector('div.button-wrapper > a');
            let link2 = document.querySelector('div.col-md-12 > a');
            return link1?.href ||  link2?.href 
        })
        jobsDetails.applyLink = applyLink;

          await page.waitForTimeout(4000)
          medicalJobs.push(jobsDetails)
        }
       await page.waitForTimeout(5000)
        console.log(medicalJobs); 
        await browser.close();
        // await page.close();
      return medicalJobs;

    } catch (err) {
        console.error(err)
    }
}

medical_Park(); 
 14  services/pageScrol