import puppeteer from "puppeteer";


let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];

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
const stellenausschreibungen = async () =>{
          try {
            const browser = await puppeteer.launch({
                headless: false
                })
            const page = await browser.newPage();
        //    await page.goto(
        //        "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=16"
        //        )
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
       
         let location = await page.evaluate( ( ) =>{
            let locatin = document.querySelector('#scheme_detail_data > ul:nth-child(1) > li:nth-child(1)')
            return locatin ? locatin.innerText : null
        })
        jobObject.location =  location;
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
            level == "Assistenzarzt"
          ) {
            jobObject.position = "artz";
          }
    
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            jobObject.position = "pflege";
            jobObject.level = "Nicht angegeben";
          }
       if (!position in positions) {
        continue;
      }
         await page.waitForTimeout(4000)
        allDetails.push(jobObject)
     }
     console.log(allDetails);
        await browser.close();
        // await page.close();
        return allDetails
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

      stellenausschreibungen()