import puppeteer from "puppeteer";


let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let besthadIslerlohnde = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    const allJoblinks = []
    const links = ["https://www.bethanien-iserlohn.de/karriere/stellenangebote#sr",
    "https://www.bethanien-iserlohn.de/karriere/stellenangebote/page/2?cHash=8e588df8e7db8fcc40a9c85cf8b3e48c#sr"
]

    let counter = 0
    do {
        await page.goto(links[counter], {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".col-xs-12 > h4 a")
      ).map((el) => el.href);
    });
   allJoblinks.push(...jobLinks)
    counter++

    } while (counter < links.length);
    console.log(allJoblinks);
    let allJobs = [];

    for (let jobLink of allJoblinks) {
      let job = {
        title: "",
        location: "",
        hospital: "GFO Kliniken Rhein-Berg, Betriebsstätte Marien-Krankenhaus",
        link: "",
        level: "",
        position: "",
        city: "Bergisch Gladbach",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
    //   let tit = 0;
    //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".col-md-10.col-xs-12 h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
   
    

      job.location = await page.evaluate(() => {
        let loc = document.querySelector(".news-text-wrap.col-md-8.col-xs-12");
        return loc ? loc.innerText.match(/[a-zA-Z-.].+ \d+ [a-zA-Z-.]+/) : ""
        
      });

      if(typeof job.location == 'object' && job.location != null ){
        job.location = job.location[0]
      }
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

      //get link\

      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/);
      });
      if(typeof job.email == "object" && job.email != null ){
        job.email = job.email[0]
      }
      // job.email = email

      // get link 
    //   let link1 = 0;
    //   if (link1) {
    //     const link = await page.evaluate(() => {
    //       let applyLink = document.querySelector('a.onlinebewerben.btn.btn--invert')
    //       return applyLink ? applyLink.href : ""
    //     })
    //     job.link = link;
    //   } else {
        job.link = jobLink
    //   }



      allJobs.push(job);
    }
    console.log(allJobs)
    await browser.close();
    return allJobs.filter((job) => job.position != "");
  } catch (e) {
    console.log(e);
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
}
besthadIslerlohnde()
// export default besthadIslerlohnde