import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];
const bgKliniken = async () => {
    
    try {
        const browser = await puppeteer.launch(
            {headless: false,
             defaultViewport: null});
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        // scroll the page
        let allJobs = [];
        let allLinks = [
            "https://www.bg-kliniken.de/universitaetsklinikum-bergmannsheil-bochum/karriere/offene-stellen/?origin=4&area=&type=&"
        ];


        let counter = 0;
        do {
            await page.goto(allLinks[counter], {timeout: 0});
            scroll(page);
            // get all job links
            let jobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ol.fce__list > li.fce__item > a")
                ).map(el => el.href);
             });
            allJobs.push(... jobs);
            counter++;
            await page.waitForTimeout(3000);
        } while (counter < allLinks.length);
        console.log(allJobs);
   
        let allJobDetails = [];
    //get data from every job post
    for (let i = 0; i < allJobs.length; i++) {
      let job = {
        title: "",
        location: "BG University Hospital Bergmannsheil Bochum",
        hospital: "BG Kliniken",
        link: "",
        level: "",
        position: "",
      };
      await page.goto(allJobs[i]);
      scroll(page);
      let title = await page.evaluate(() => {
        let title = document.querySelector('.fce__text > h1')
        return title ? title.innerText : null;
      });
      job.title = title;
      const applyLink = await page.evaluate( () => {
          let link = document.querySelector('.fce__innerwrap > p > a')
          return link ? link.href : null
      })
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
      }
    
     await page.waitForTimeout(3000)
      allJobDetails.push(job);
    }
    console.log(allJobDetails);
    await browser.close()
    // await page.close()
    return allJobDetails.filter((job) => job.position != "");
    
}catch(err) {
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
  }

bgKliniken()

