import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let haushohenlim1 = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();


            await page.goto("https://haushohenlimburg.de/jobs", {
                waitUntil: "load",
                timeout: 0,
            });
            //scroll the page
            await scroll(page)
           

    let allJobs = [];



      let job = {
        title: "",
        location: "Hagen",
        hospital: "Haus Hohenlimburg",
        link: "",
        level: "",
        position: "",
      };

    //   await page.waitForTimeout(3000)
    //   await page.waitForSelector('h1')
      let title = await page.evaluate(() => {
        let ttitle = Array.from(document.querySelectorAll("h4"));
        return ttitle ? ttitle.map(el => el.innerText) : "";
      });
      job.title = title;

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
        console.log(ok)
      }

      //get link
      let link = await page.evaluate(() => {
        let applyLink = document.querySelector('.siteorigin-widget-tinymce.textwidget');
        return applyLink ? applyLink.innerText.match(/[a-zaA-Z-.]+@[a-zaA-Z-.]+/) : "";
      
      })
      
        job.link = link

      
      allJobs.push(job);
    
    console.log(allJobs);
    await browser.close();
    await page.close();
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

haushohenlim1()
// export default gtkKrefeld;



