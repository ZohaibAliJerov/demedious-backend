import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const stJosefPaderborn = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto(
           "https://www.cardioclinic-koeln.de/cardioclinic-koeln/stellenausschreibungen"
           )
        page.setDefaultNavigationTimeout(0);
        const jobLinks = [ ];
        let allUrls = [
            "https://www.cardioclinic-koeln.de/cardioclinic-koeln/stellenausschreibungen"
           ]
            // get all jobs links 
        for(let a = 0;a < allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('.csc-textpic-text > ul > li > a'))
            .map((el) => el.href);

        })
        jobLinks.push(...jobs)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);
    let allDetails = [ ];
    for(let details of jobLinks) {
        let job = {
            title: "",
            location: "Sundern (Sauerland)",
            hospital: "Neurologische Klinik Sorpe",
            link: "",
            level: "",
            position: "",
          };
        scroll(page)
        await page.goto(details)
     let title = await page.evaluate ( () => {
        let title = document.querySelector('.csc-textpic-text > p:nth-child(3)')
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

      //get link
      let link = await page.evaluate(() => {
        return document.body.innerText.match(/[A_Za-z0-9._+/-]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
      });
      if (typeof link == "object") {
        job.link = link[0];
      }
     allDetails.push(job)
    }
    console.log(allDetails);
        
       
        await browser.close();
        // await page.close();
        return allDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err)
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
  }

export default stJosefPaderborn;