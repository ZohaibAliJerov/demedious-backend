import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let gtkKrefeld = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: true,
    });

    let page = await browser.newPage();
    // let url = []

    await page.goto("https://haushohenlimburg.de/jobs", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    // //get all jobLinks
    // const jobLinks = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll(".gi.cell.breakword a")
    //   ).map((el) => el.href);
    // });

    // console.log(jobLinks);
    let allJobs = [];

    // for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Haus Hohenlimburg",
        link: "",
        level: "",
        position: "",
        city: "Hagen",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      // await page.goto(jobLink, {
      //   waitUntil: "load",
      //   timeout: 0,
      // });

      await page.waitForTimeout(1000);
    //   let tit = 0;
    //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector(".siteorigin-widget-tinymce.textwidget");
          return ttitle ? ttitle.innerText.slice(68 , 268) : "";
        });
        job.title = title;
    //   }else{
    //     let title = await page.evaluate(() => {
    //       let ttitle = document.querySelector(".news-single-item h2");
    //       return ttitle ? ttitle.innerText : "";
    //     });
    //     job.title = title;
    //   }
    

      job.location = await page.evaluate(() => {
        let loc = document.querySelector("#text-10");
        return loc ? loc.innerText.match(/[a-zA-Z ].+\d+-\d+[\n]\n\d+ [a-zA-Z ]+/) : ""
        
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
        console.log('fulltime ')
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
      // let link1 = 0;
      // if (link1) {
      //   const link = await page.evaluate(() => {
      //     let applyLink = document.querySelector('a.onlinebewerben.btn.btn--invert')
      //     return applyLink ? applyLink.href : ""
      //   })
      //   job.link = link;
      // } else {
        job.link = "https://haushohenlimburg.de/jobs"
      // }



      allJobs.push(job);
 
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
// gtkKrefeld()
export default  gtkKrefeld


