import puppeteer  from "puppeteer";

const lwlJobOffer = async () => {
   
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(
          "https://psychiatrie.lwl-uk-bochum.de/die-klinik/stellenangebote"
          )
      page.setDefaultNavigationTimeout(0);
  
      //scroll the page
      let allJobs = [];
      let allLinks = [
          "https://psychiatrie.lwl-uk-bochum.de/die-klinik/stellenangebote"
        ];
      let counter = 0;
      do {
        await page.goto(allLinks[counter], { timeout: 0 });
        scroll(page);
        //get all job links
  
        let jobs = await page.evaluate(() => {
          return Array.from(
              document.querySelectorAll("#parent-fieldname-text-9ce5adb0c3d949e589392a76920f2e78 > p > a")
               ).map((el) => el.href);
        });
        allJobs.push(...jobs);
        counter++;
        await page.waitForTimeout(3000);
      } while (counter < allLinks.length);
      console.log(allJobs);
      let allJobDetails = [];
      //get data from every job post
      for (let i = 0; i < allJobs.length; i++) {
        let job = {
            title: "",
            location: "Alexandrinenstr. 1-3 44791 Bochum",
            hospital: "LWL-Universitätsklinikum Bochum",
            link: "",
            level: "",
            position: "",
         };
        await page.goto(allJobs[i]);
        scroll(page);
        let title = await page.evaluate(() => {
          let title = document.querySelector('div.text > h1');
          return title ? title.innerText : null;
        });
        job["title"] = title;

      const applyLink = await page.evaluate( () => {
          let link = document.querySelector('.applyBtn.apply > a');
          return link ? link.href : null;
      })
      job["ApplyLink"] = applyLink;

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
      }
        allJobDetails.push(job)
    }
    console.log(allJobDetails);
   
    await browser.close();
    // await page.close();
    return allJobDetails.filter((job) => job.position != "");
};

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


