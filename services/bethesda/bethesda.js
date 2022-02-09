import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let bethesda = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto("https://www.bethesda-krankenhaus-duisburg.de/karriere/%C3%A4rztlicher-dienst/",
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
          document.querySelectorAll("div#cc-m-15610400224 > ul > li > strong > a")
        ).map((el) => el.href);
      });
      allJobLinks.push(...jobLinks);
      await page.waitForTimeout(1000);
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector("li.c-pagination__item.c-pagination__item--next-page > a");
      });
      if (bottomNextLink) {
        await page.click("li.c-pagination__item.c-pagination__item--next-page > a");
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
            location: "47053 Duisburg",
            hospital: "bethesda",
            city : "Duisburg",
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
            let ttitle = document.querySelector("h3#cc-m-header-15272409624");
            return ttitle ? ttitle.innerText : "";
          });
          job.title = title;
    
          let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //get email
          let email = await page.evaluate(()=>{
              return document.body.innerText.match(/\w+.\w+\@\w+.\w+ | \w+\@\w+.\w+/) || "N/A";
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
    bethesda()
    export default bethesda;
