import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let badberleburgg = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto("https://www.vamed-gesundheit.de/kliniken/bad-berleburg/unser-haus/karriere/stellenangebote/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );
    let allJobs = [];
      //scroll the page
      await page.waitForTimeout(1000)
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("article.tabular-list__item > a")
        ).map((el) => el.href);
      });
  
    console.log(jobLinks)
        for (let jobLink of jobLinks) {
          let job = {
            title: "",
            location: "57319 Bad Berleburg",
            hospital: "VAMED Klinik Bad Berleburg",
            city : "Bad Berleburg",
            link: "",
            level: "",
            email : "",
            position: "",
            republic: "North Rhine-Westphalia"
          };
          await page.goto(jobLink, {
            waitUntil: "load",
            timeout: 0,
          });
    
          await page.waitForTimeout(1000);
          //get title
          let title = await page.evaluate(() => {
            let ttitle = document.querySelector("h1.content-page-header__title");
            return ttitle ? ttitle.innerText : "";
          });
          job.title = title;
    
          let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //get email
          let email = await page.evaluate(()=>{
            return document.body.innerText.match(/\w+.\w+\d+\@\w+\-\w+.\w+/) || "N/A"
          })
          job.email = String() + email
          //apply link
          job.link  = jobLink
          //get level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
          let position = text.match(/arzt|pflege/);
          job.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt"||
            level == "Arzt"||
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
    
          allJobs.push(job);
        }
        console.log(allJobs);
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
    badberleburgg()
    export default badberleburgg;
