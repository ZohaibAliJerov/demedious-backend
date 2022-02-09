import puppeteer from "puppeteer";

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
  };
let KrankenhausMorsenbroich_Rath = async () => {
  try {
    let browser = await puppeteer.launch({
      headless:false,
    });

    let page = await browser.newPage();

    await page.goto(
        "https://kmrdd.pi-asp.de/bewerber-web/?companyEid=*&lang=D&position_cats=8bbc455b-44f6-4cfd-bbfa-860daa9e75ca#positions", 
        {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("tbody > tr:nth-child(1) > td:nth-child(1)")
      ).map((el) => el.innerText);
    });
await page.waitForTimeout(1000)
    console.log(jobLinks);
    // let allJobs = [];

    // for (let jobLink of jobLinks) {
    //   let job = {
    //     title: "",
    //     location: "",
    //     hospital: "Krankenhaus Mörsenbroich-Rath GmbH / St. Vinzenz-Krankenhaus",
    //     link: "",
    //     level: "",
    //     position: "",
    //     city: "Düsseldorf",
    //     email: "",
    //     republic: "North Rhine-Westphalia",
    //   };

    //   await page.goto(jobLink, {
    //     waitUntil: "load",
    //     timeout: 0,
    //   });

    //   await page.waitForTimeout(1000);

    //   job.title = jobLink;

    //   job.location = await page.evaluate(() => {
    //     let loc = document.querySelector('div.wrapper > div:nth-child(1)').innerText;
    //     loc = loc.replace("\n", " ");
    //     return loc.replace(/\w+@\w+\.\w+/, "");
    //   });

    //   let text = await page.evaluate(() => {
    //     return document.body.innerText;
    //   });
    //   //get level
    //   let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
    //   let position = text.match(/arzt|pflege/);
    //   job.level = level ? level[0] : "";
    //   if (
    //     level == "Facharzt" ||
    //     level == "Chefarzt" ||
    //     level == "Assistenzarzt" ||
    //     level == "Arzt" ||
    //     level == "Oberarzt"
    //   ) {
    //     job.position = "artz";
    //   }
    //   if (position == "pflege" || (position == "Pflege" && !level in levels)) {
    //     job.position = "pflege";
    //     job.level = "Nicht angegeben";
    //   }

    //   if (!position in positions) {
    //     continue;
    //   }

    //   //get link
    // //   job.email = await page.evaluate(() => {
    // //     return document.body.innerText.match(/\w+@\w+\.\w+/);
    // //   });
    // //   if (typeof job.email == "object") {
    // //     job.email = "" + job.email
    // //   }
     
    //   job.link = jobLink;
      
    //   allJobs.push(job);
    // }
    // await page.waitForTimeout(3000)
    // console.log(allJobs);
    await browser.close()
    // await page.close()
    // return allJobs.filter((job) => job.position != "");
  } catch (e) {
    console.log(e);
  }
};



KrankenhausMorsenbroich_Rath()