import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];

  const marienHospital = async () => {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    //   await page.goto ("https://dreifaltigkeits-hospital.de/erwitte/ausbildung-karriere/aerztlicher-dienst/aktuelle-stellenangebote/")
      page.setDefaultNavigationTimeout(0);
      // scroll the page
      let allJobs = [ ];
      let allLinks = [ 
          "https://dreifaltigkeits-hospital.de/erwitte/ausbildung-karriere/aerztlicher-dienst/aktuelle-stellenangebote/" ];
      let counter = 0;
      do {
        await page.goto(allLinks[counter], { timeout: 0 });
        scroll(page);
        //get all job links
  
        let jobs = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll(".col-md-3 > a")
          ).map((el) => el.href);
        });
        allJobs.push(...jobs);
        counter++;
        await page.waitForTimeout(3000);
      } 
      while (counter < allLinks.length);
    
      console.log(allJobs);
      let allJobDetails = [];
      //get data from every job post
      for (let i = 0; i < allJobs.length; i++) {
        let jobs = { 
            title: "",
            location: "Dreifaltigkeits-Hospital Lippstadt",
            hospital: "Marien-Hospital Etwitte",
            link: "",
            level: "",
            position: "",
        };
        await page.goto(allJobs[i]);
        scroll(page);
        // await page.waitForSelector(".header-info");
        let title = await page.evaluate(() => {
          let jbtitle = document.querySelector("span.big > strong");
          return jbtitle ? jbtitle.innerText : null;
        });

        jobs["title"] = title;

        let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //get level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
          let position = text.match(/arzt|pflege/);
          jobs.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt"
          ) {
            jobs.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            jobs.position = "pflege";
            jobs.level = "Nicht angegeben";
          }
    
          if (!position in positions) {
            continue;
          }


        //   for mail 
        let link = await page.evaluate(() => {
            return document.body.innerText.match(/\w+@\w+\.\w+/);
          });
        //   if (typeof link == "object") {
        //     jobs.link = link[0];
        //   }
        let mail = await page.evaluate(() => {
            let email = document.querySelector('body div > p > a')
            return email ? email.href : null
        })
        jobs.link = mail;
        allJobDetails.push(jobs);
    }
    console.log(allJobDetails);



      
    
    

    await page.close();
    await browser.close();
    return allJobDetails.filter((jobs) => jobs.position != "");
  }

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


marienHospital()

