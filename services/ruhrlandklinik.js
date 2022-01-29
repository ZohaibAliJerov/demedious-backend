import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const ruhrlandklinik = async () => {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();

    let url = "https://www.ruhrlandklinik.de/karriere/stellenangebote/";
    await page.goto(url, { timeout: 0, waitUntil: "load" });

    //scroll the page
    await scroll(page);
    await page.waitForTimeout(5000);
    //get all links
    let links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("article > div > p > a")).map(
            (el) => el.href
        );
    });
    let titles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("article > div > p ")).map(
            (el) => el.innerText
        );
    });

    console.log(links);
    //slice the links

    //get all job details
return  titles.map(async(title, index) => {
       
        let job = {
            title:"",
            location: "",
            hospital: "Ruhrlandklinik, Westdeuts",
            link: "",
            level: "",
            position: "",
            city: "Essen",
            email: "",
            republic: "North Rhine-Westphalia",
        };
    
        job.title = title;

        job.email = await page.evaluate(() => {
            return document.body.innerText.match(/\w+@.*\.\w/).toString();
        });
        
        let text = title;
        //get level and positions
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

        if (position in positions) {
            continue;
        }
        job.link = links[index];
        return job;
    });
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

// export default wessel;
(async () => {
  let res = await ruhrlandklinik();
  console.log(res);
})();
