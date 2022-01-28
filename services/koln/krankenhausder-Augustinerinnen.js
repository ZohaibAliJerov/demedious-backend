import puppeteer  from "puppeteer";

const krankenhausser_Augustinerinnen = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto(
           "https://www.severinskloesterchen-karriere.de/stellenangebote/"
           )
        page.setDefaultNavigationTimeout(0);
       
        const jobLinks = [ ];
        let allUrls = [
            "https://www.severinskloesterchen-karriere.de/stellenangebote/"
            ]
            // all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('div.job-offers-list > ul > li > a')
            ).map((el) => el.href);
        })
        jobLinks.push(...jobs)
    }
    await page.waitForTimeout(3000);
        console.log(jobLinks);
    
        const jobDetails = [ ];
        for (let job of jobLinks) {
            let details ={
                title: "",
                location: "Köln",
                hospital: "Krankenhaus der Augustinerinnen \"Severinsklösterchen\"",
                link: "",
                level: "",
                position: "",
              };
            scroll(page);
            await page.goto(job) 
            let title = await page.evaluate( () =>{
                let title = document.querySelector('div.bewerbung-title > h1')
                return title ? title.innerText : null
            })
            details.title = title;
            let text = await page.evaluate(() => {
                return document.body.innerText;
              });
              //get level
              let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
              let position = text.match(/arzt|pflege/);
              details.level = level ? level[0] : "";
              if (
                level == "Facharzt" ||
                level == "Chefarzt" ||
                level == "Assistenzarzt" ||
                level == "Arzt" ||
                level == "Oberarzt"
              ) {
                details.position = "artz";
              }
              if (position == "pflege" || (position == "Pflege" && !level in levels)) {
                details.position = "pflege";
                details.level = "Nicht angegeben";
              }
        
              if (!position in positions) {
                continue;
              }
            let applyLink = await page.evaluate ( () =>{
                let apply = document.querySelector('a.button-jetzt-bewerben')
                return apply ? apply.href : null
           })
           details.link = applyLink
            
    
    
          await page.waitForTimeout(4000)
          jobDetails.push(details)
        }
        console.log(jobDetails);
    


        await browser.close();
        // await page.close();
        return jobDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err)
    }
}

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

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
  }


  