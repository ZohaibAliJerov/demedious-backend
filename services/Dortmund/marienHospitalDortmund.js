import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];

const marienHospital_Dortmund = async () => {
    try {
        const browser = await puppeteer.launch({headless: false})
        const page = await browser.newPage();
        await  page.goto(
            "https://www.karriere-johannes.de/jobs.html?term=&bereich=&einrichtung=3"
            );
        page.setDefaultNavigationTimeout(0);
        const jobLinks = [];
        let allLinks = [
            "https://www.karriere-johannes.de/jobs.html",
         "https://www.karriere-johannes.de/jobs.html?page_n15=2", 
         "https://www.karriere-johannes.de/jobs.html?page_n15=3",
         "https://www.karriere-johannes.de/jobs.html?page_n15=4",
         "https://www.karriere-johannes.de/jobs.html?page_n15=5",
         "https://www.karriere-johannes.de/jobs.html?page_n15=6",
         "https://www.karriere-johannes.de/jobs.html?page_n15=7"
        ];
        let counter = 0;
        do {
            await page.goto(allLinks[counter]);
            scroll(page);
            // all job links
            let jobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('h2 > a')).map((el) => el.href);
            });
            jobLinks.push(... jobs);
            counter++;
        } while (counter < allLinks.length);
        await page.waitForTimeout(3000)
        console.log(jobLinks);
        const jobDetails = [];
        for (let hrefs of jobLinks) {
            await page.goto(hrefs)
            scroll(page)
            let details = {
             title: "",
            location: "Dortmund",
            hospital: "Marien Hospital Dortmund",
            link: "",
            level: "",
            position: "",
            };

            page.waitForSelector("h1")
            let title = await page.evaluate(() => {
                let jobTitle = document.querySelector('div.mod_ng_bwm_details  > h1')
                return jobTitle ? jobTitle.innerText : null
            })
            // get Titles

            details.title = title;
            let text = await page.evaluate(() => {
                return document.body.innerText;
              });
              //level
              let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
              let position = text.match(/arzt|pflege/);
              details.level = level ? level[0] : "";
              if (
                level == "Facharzt" ||
                level == "Chefarzt" ||
                level == "Assistenzarzt"
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
            let applyLink = await page.evaluate(() => {
                let link1 = document.querySelector('.online-bewerben > a');
                let link2 = document.querySelector('.stellenangebot-datei.link > a');
                return link1 ?. href || link2 ?. href;
            })
            // apply Links
            details.link = applyLink;
           await page.waitForTimeout(4000)
            jobDetails.push(details)
        }
        console.log(jobDetails);


        await browser.close();
        //  await page.close()
        return jobDetails.filter((job) => job.position != "");
    } catch (er) {
        console.log(er);
    }
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
  

