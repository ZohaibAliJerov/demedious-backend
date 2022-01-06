import puppeteer from "puppeteer";
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
};
const diakonischeStiftung_Wittekindshof = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
    //    await page.goto(
    //        "https://karriere-wittekindshof.de/"
    //        )
        page.setDefaultNavigationTimeout(0);
        const jobLinks = [ ];
        let allUrls = [
            "https://karriere-wittekindshof.de/"
           ]
            // get all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('div.joboffer_title_text.joboffer_box > a'))
            .map((el) => el.href);

        })
        jobLinks.push(...jobs)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);
     
    let allDetails = [ ];
    for(let details of jobLinks) {
        let job = {
            title: "",
            location: "Bad Oeynhausen",
            hospital: "Diakonische Stiftung Wittekindshof",
            link: "",
            level: "",
            position: "",
          };
        scroll(page)
        await page.goto(details)
     let title = await page.evaluate ( () => {
        let title = document.querySelector('div.scheme-content.scheme-title > h1')
        return title ? title.innerText : null
     })
     job.title = title;
  
     let applyLink = await page.evaluate( () =>{
         let link = document.querySelector('div#btn_online_application > a')
         return link ? link.href : null;
     })
     job.link = applyLink
    if (typeof applyLink == "object" && email != null) {
        applyLink = applyLink[0];
      } else if (applyLink == null) {
       applyLink = " ";
      }
      job.link = applyLink
      let text = await page.evaluate(() => {
         return document.body.innerText;
       });
       //get level
       let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
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

     await page.waitForTimeout(4000)
    allDetails.push(job)
    //  jobObject.push(allDetails)
    }
    console.log(allDetails);
        
   
        await browser.close();
        // await page.close();
        return allDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err)
    }
}
let positions = ["arzt", "pflege"];
let levels = [ "Facharzt",  "Chefarzt", "Assistenzarzt", "Arzt",  "Oberarzt" ];

export default diakonischeStiftung_Wittekindshof;