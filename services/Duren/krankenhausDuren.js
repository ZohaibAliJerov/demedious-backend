import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];
const krankenhausDuren  = async () => {
    try {
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage();
       await page.goto(
           "https://www.krankenhaus-dueren.de/index.php"
           );
    //    page.setDefaultNavigationTimeout(0);
       
       const jobLinks = [ ];
       let allUrls = [
           "https://www.krankenhaus-dueren.de/index.php/stellenangebote-krankenhaus-dueren"
       ];
       for(let a=0;a<allUrls.length; a++) {
          await page.goto(allUrls[a])
          scroll(page);
       let job = await page.evaluate( ()=>{
           return Array.from(document.querySelectorAll('div.itemlist_title > a')
           ).map((el) => el.href);
       })
       jobLinks.push(...job)
       }
    //    await page.waitForTimeout(3000);
       console.log(jobLinks);

       const jobDetails = [ ];
       for (let links of jobLinks) {
           await page.goto(links)
           scroll(page);
           let job =  {
            title: "",
           location: "Düren",
           hospital: "Krankenhaus Düren",
           link: "",
           level: "",
           position: "",
           };
           // page.waitForSelector(".accordion-title")
           const title = await page.evaluate( () => {
               let jobTitle = document.querySelector('h3.jobtitle')
               return jobTitle ? jobTitle.innerText : null
           })
           job.title = title;
           let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
          let position = text.match(/arzt|pflege/);
          job.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt"
          ) {
            job.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            job.position = "pflege";
            job.level = "Nicht angegeben";
          }
    
          if (!position in positions) {
            continue;
          };
        
        
          jobDetails.push(job)
        }
        // await page.waitForTimeout(4000)
       console.log(jobDetails);

       await browser.close()
    //    await page.close()
    return jobDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err)
    }
};
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

 