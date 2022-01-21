import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
const krankenhausder_Augustin = async () =>{
    try {
      let browser = await puppeteer.launch({
        headless: false,
      });
  
      let page = await browser.newPage();
  
      await page.goto("https://www.severinskloesterchen-karriere.de/stellenangebote/", {
        waitUntil: "load",
        timeout: 0,
      });
  
      await scroll(page);
  
      //get all jobLinks
      const jobLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("div.job-offers-list > ul > li >a"))
        .map((el) => el.href);
      });
  
      console.log(jobLinks);
        let allJobs = [];
        for (let jobLink of jobLinks) {
          let job = {
            title: "",
            location: "",
            hospital: "Krankenhaus der Augustinerinnen \"Severinsklösterchen\"",
            link: "",
            level: "",
            position: "",
            email:"",
            city:"Köln",
            republic:"North Rhine-Westphalia"
          };
          await page.goto(jobLink, {
            waitUntil: "load",
            timeout: 0,
          });
          let title = await page.evaluate(() => {
            let ttitle = document.querySelector('div.bewerbung-title > h1')
            return ttitle ? ttitle.innerText : null
          });
          job.title = title;
          job.location = await page.evaluate(() => {
            let loc = document.querySelector('div.bewerbung-content > p:nth-child(16)')
            // loc = loc.replace("\n", " ");
            // return loc.replace(/\w+@\w+\.\w+/, "");
            return loc ? loc.innerText.match(/Ho[A-Za-z]+.[A-Za-z]+.[A-Za-z]+.[A-Za-z,.]+.[A-Za-z,.]+.[A-Za-z,.]+.[A-Za-z,.]+.[A-Za-z,.]+.[A-Za-z]+.[A-Za-z]+.[A-Za-z]+.[A-Za-z0-9]+.[A-Za-z0-9]+.[A-Za-z0-9,.]+.[A-Za-z0-9,._-]+.[A-Za-z0-9,._-]+.[ A-Za-z0-9,._-]+.[ A-Za-z0-9,._-]+./g) : null
          });
    
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
            let mail = document.querySelector('a.mail');
            return mail ? mail.href.match(/[a-zA-Z0-9/_.-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9]/) : null
          });
          if (typeof job.email == "object") {
            job.email = "" + job.email
          }
    
          job.link = jobLink;
          //get link
          let link = await page.evaluate( () =>{
            let link = document.querySelector('a.button-jetzt-bewerben')
            return link ? link.href : null;
          })
          job.link = link;
         
          // console.log(job);
          allJobs.push(job);
        }
      console.log(allJobs);
        await browser.close()
        // await page.close()
        return allJobs.filter((job) => job.position != "");
      } catch (err) {
        console.error(err);
      }
    };
    export async function scroll(page) {
        await page.evaluate(() => {
            const distance = 100;
            const delay = 100;
            const timer = setInterval(() => {
                document.scrollingElement.scrollBy(0, distance);
                if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
                    clearInterval(timer);
                }
            }, delay);
        });
    };
