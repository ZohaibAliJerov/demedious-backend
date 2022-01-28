import puppeteer  from "puppeteer";
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
const krankenhaus_porz = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto(
           "https://www.khporz.de/de/karriere-bei-uns.html"
           )
        page.setDefaultNavigationTimeout(0);
       
        const jobLinks = [ ];
        let allUrls = [
            "https://www.khporz.de/de/meldungen-und-veranstaltungen/stellenausschreibungen.html"
            ]
            // all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('div.listable-list-item__content > p> a'))
            .map((el) => el.href);
        })
        jobLinks.push(...jobs)
    }
    await page.waitForTimeout(3000);
        console.log(jobLinks);
    const details = [ ];
    for (let links of jobLinks) {
        let job ={
            title: "",
            location: "Köln",
            hospital: "Krankenhaus Porz am Rhein",
            link: "",
            level: "",
            position: "",
          };
        scroll(page);
        await page.goto(links);
        const title = await page.evaluate( () =>{
        let title = document.querySelector('div.content-body > h2')
          return title ? title.innerText : null
        })
        job.title = title;
    
     let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
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
      let link = await page.evaluate(() => {
        return document.body.innerText.match(/[A_Za-z0-9._+/-]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
      });
      if (typeof link == "object") {
        job.link = link;
      }
        await page.waitForTimeout(4000)
        details.push(job)
    }
       console.log(details);
    


        await browser.close();
        // await page.close();
        return details.filter((job) => job.position != "");

    } catch (err) {
        console.error(err)
    }
}

export default krankenhaus_porz;

