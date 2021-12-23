import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];
const marienHospital_bruhl  = async () => {
    try {
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage();
       await page.goto("https://www.marienhospital-bruehl.info/service/karriere/stellenangebote.html");
       page.setDefaultNavigationTimeout(0);
       
       const jobLinks = [ ];
       let allUrls = [
           "https://www.marienhospital-bruehl.info/service/karriere/stellenangebote.html"
       ];
       for(let a=0;a<allUrls.length; a++) {
          await page.goto(allUrls[a])
          scroll(page);
       let job = await page.evaluate( ()=>{
           return   Array.from(document.querySelectorAll('.breakword > a')
           ).map((el) => el.href);
       })
       jobLinks.push(...job)
       }
       await page.waitForTimeout(3000);
       console.log(jobLinks);

       const jobDetails = [ ];
       for (let links of jobLinks) {
           await page.goto(links)
           scroll(page);
           let job =  {
            title: "",
           location: "Brühl",
           hospital: "Marienhospital Brühl",
           link: "",
           level: "",
           position: "",
           };
           // page.waitForSelector(".accordion-title")
           const title = await page.evaluate( () => {
               let jobTitle1 = document.querySelector('div.inner > h2');
               let jobTitle2 = document.querySelector('div.pageHeadline ');
               return jobTitle1?.innerText || jobTitle2?.innerText
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
         
           let applyLink = await page.evaluate( () =>{
              let link = document.querySelector('a.onlinebewerben.btn.btn--invert');
              return link ? link.href : null
           })
         job.link = applyLink;
        
           await page.waitForTimeout(4000);
           jobDetails.push(job)
       }
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
marienHospital_bruhl();
