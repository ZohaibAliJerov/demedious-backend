import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];


let fachKlinikOstberge = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    let link = "https://fachklinik-ostberge.de/freie-stellen"
    await page.goto(link , {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);
  
    let allJobs = [];
      let job = {
        title: "",
        location: "",
        hospital: "Fachklinik Ostberge",
        link: "",
        level: "",
        position: "",
        city: "Dortmund",
        email: "",
        republic: "Federal Republic of Germany"
      };
   
      await page.waitForTimeout(1000);
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("#post-49 > div > ul > li > span");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      
      job.location = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.ö].+ \d+[\n][\n]\d+ [a-zA-Z-.ö]+/) || ""
        
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
    //   if (!position in positions) {
    //     continue;
    //   }
      //get email 
      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/);
      });
      if(typeof job.email == "object" && job.email != null ){
        job.email = job.email[0]
      }

      job.link = link
      allJobs.push(job);
    
    console.log(allJobs)
    await page.close();
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
      ){
          clearInterval(timer)
      }
    }, delay)
});
}
fachKlinikOstberge()
