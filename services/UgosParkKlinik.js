import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let ugos_deParkKlinik = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    let url = [ "https://www.ugos.de/karriere/park-klinik?id=2066&tx_kesearch_pi1%5Bpage%5D=1&tx_kesearch_pi1%5BresetFilters%5D=0&tx_kesearch_pi1%5BsortByField%5D=&tx_kesearch_pi1%5BsortByDir%5D=&tx_kesearch_pi1%5Bfilter%5D%5B1%5D=&tx_kesearch_pi1%5Bfilter%5D%5B2%5D=Bad-Hermannsborn&tx_kesearch_pi1%5Bfilter%5D%5B3%5D=",
                "https://www.ugos.de/karriere/park-klinik/seite-2" ]

        let allJobLinks = []
        let counter = 0
        do {
            await page.goto(url[counter], {
                waitUntil: "load",
                timeout: 0,
            });
            //wait for a while
            await page.waitForTimeout(1000);

            //scroll the page
            await scroll(page)

            //get all jobLinks
            let jobLinks = await page.evaluate(() => {
                return Array.from(
                    document.querySelectorAll(".articletype-0.jobs > h3 a")
                ).map((el) => el.href);
            });
            allJobLinks.push(...jobLinks)
            counter++;

        } while (counter < url.length);
        console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      let job = {
        title: "",
        location: "Bad Driburg",
        hospital: "Gräfliche Kliniken - Park Klinik Bad Hermannsborn",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink)
      await page.waitForTimeout(3000)
      await page.waitForSelector('h1')
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1");
        return ttitle ? ttitle.innerText : "";
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
        continue;
      }

      //get link
      let link = await page.evaluate(() => {
        let applyLink = document.querySelector('body');
        return applyLink ? applyLink.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+/) : "";
      
      })
      
        job.link = link

      
      allJobs.push(job);
    }
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

// ugos_deParkKlinik()
export default ugos_deParkKlinik;



