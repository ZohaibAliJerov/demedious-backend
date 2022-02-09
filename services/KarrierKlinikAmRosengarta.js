import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let gfo_kliniken = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: true,
    });

    let page = await browser.newPage();
    let Mainlink = "https://www.karriere-klinikamrosengarten.de/eth-unterseite.html"

    await page.goto(Mainlink, {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    // const jobLinks = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll(".m-content > h2 a")
    //   ).map((el) => el.href);
    // });

    // console.log(jobLinks);
    let allJobs = [];

    // for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Klinik am Rosengarten",
        link: "",
        level: "",
        position: "",
        city: "Bad Oeynhausen",
        email: "",
        republic: "North Rhine-Westphalia",
      };

    //   await page.goto(jobLink, {
    //     waitUntil: "load",
    //     timeout: 0,
    //   });

      await page.waitForTimeout(1000);
   
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(" h1");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
    

      job.location = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.]+ \d+ [|] \d+ \w+ \w+/) || "Westkorso 22 | 32545 Bad Oeynhausen"
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
        console.log('na')
      }

      //get link\

      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) || "mpg@klinikamrosengarten.de"
      });
      if(typeof job.email == "object" && job.email != null ){
        job.email = job.email[0]
      }
      // job.email = email

      // get link 
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector('.button-3.transparent')
          return applyLink ? applyLink.href : ""
        })
        job.link = link;
      } else {
        job.link = Mainlink
      }



      allJobs.push(job);
    // }
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
// gfo_kliniken()
export default gfo_kliniken
