

import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let karrierKrapp= async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.evkk.de/karriere/stellenausschreibungen/", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("ul.csc-menu.csc-menu-1 > li a")
      ).map((el) => el.href);
    });

    let titles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("ul.csc-menu.csc-menu-1 > li a")
        ).map(el => el.innerText);
      });
      console.log(titles)
  

    console.log(jobLinks);
    let allJobs = [];
      let counter = 0;
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Alfried Krupp Krankenhaus Rüttenscheid",
        link: "",
        level: "",
        position: "",
        city: "Essen",
        email: "",
        republic: "Federal Republic of Germany",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
    
       job.title = titles[counter];
       counter++;
    
      job.location = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.ö]+ \d+.\d+[\n]\d+ [a-zA-Z-.ö]+|[a-zA-Z-.ö].+ \d+[\n]\d+ [a-zA-Z-.ö]+/) || ""
        
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
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) || "info@krupp-krankenhaus.de";
      });
      if(typeof job.email == "object" && job.email != null ){
        job.email = job.email[0]
      }
      // job.email = email

      // get link 
      // let link1 = 0;
      // if (link1) {
      //   const link = await page.evaluate(() => {
      //     let applyLink = document.querySelector('.css_button a')
      //     return applyLink ? applyLink.href : ""
      //   })
      //   job.link = link;
      // } else {
        job.link = jobLink
      // }



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
karrierKrapp()
// export default karrierKrapp


