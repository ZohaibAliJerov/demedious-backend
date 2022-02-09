import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let werdohll = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto("https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5BJobListNr%5D=10&cmd=listView",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
      //scroll the page
      await scroll(page)
     
      await page.waitForTimeout(1000)
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.listitem_text > p > strong > a")
        ).map((el) => el.href);
      });
      allJobLinks.push(...jobLinks);
      await page.waitForTimeout(1000);
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector("#liste > div > div.sp1 > div:nth-child(12) > div.sp3.span_2 > a");
      });
      if (bottomNextLink) {
        await page.click("#liste > div > div.sp1 > div:nth-child(12) > div.sp3.span_2 > a");
        nextPage = true;
      } else {
        nextPage = false;
      }
    } //end of while loop
  
    console.log(allJobLinks)
    
        let allJobs = [];
    
        for (let jobLink of allJobLinks) {
          let job = {
            title: "",
            location: "1458515 Lüdenscheid",
            hospital: "Märkische Kliniken GmbH",
            city : "Lüdenscheid",
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
            let ttitle = document.querySelector("div.stellenangebote_sp1.span_8 > h1");
            return ttitle ? ttitle.innerText : "";
          });
          job.title = title;
    
          let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //get email
          let email = await page.evaluate(()=>{
            let eml = document.querySelector("#c6756 > div > div > div.stellenangebote_sp1.span_8 > div > p:nth-child(6) > a:nth-child(13)")
            return eml ? eml.innerText : "N/A";
          })
          job.email = String() + email
          //apply link
          job.link = jobLink;
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
    werdohll()
    export default werdohll;
