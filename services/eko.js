
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let Ekode = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: true,
    });

    let page = await browser.newPage();


    await page.goto("https://eko.de/unternehmen/stellenangebote.html", {
        waitForTimeout : 0
    })

    await page.waitForTimeout(1000);
    await scroll(page)
  
      // get all job links
      const jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll('.listitemtitle a')
        ).map((el) => el.href);
      });
      console.log(jobLinks);


    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Evangelisches Krankenhaus Oberhausen",
        link: "",
        level: "",
        position: "",
        city: "Oberhausen",
        email: "",
        republic: "	North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".jobmodul > div h2");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let text = document.querySelector("body");
        return text ? text.innerText.match(
          /[a-zA-Z]+. \d+ [|] \d+ [a-zA-Z,]+ [a-zA-Z]+|[a-zA-Z]+. \d+ [|] \d+ [a-zA-Z.]+|[a-zA-Z.]+ .[a-zA-Z.]+. [a-zA-Z.]+ .[a-zA-Z.]+. [a-zA-Z.]+/
        )
          : null;
      });

      if(typeof job.location =="object" && job.location != null){
        job.location = job.location[0];
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

      //get link
      job.email = await page.evaluate(() => {
        let text = document.querySelector(".mail");
        return text ? text.href : null;
      });

     if(typeof job.email == "object" && job.email != null) {
        job.email = job.email[0];
     }

      //   getting applylink
      let link = await page.evaluate(() => {
        let Link = document.querySelector('.applylink a');
        return Link ? Link.href : "";
      })
     
    job.link = link;
//    if(typeof job.link == "object") {
//         job.link = job.link;
//     } 
      allJobs.push(job);
    }
    console.log(allJobs);
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
      ) {
        clearInterval(timer);
      }
    }, delay);
  });
}

// Ekode()
export default Ekode;
