import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];

  const kkrnCatholic = async () => {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();
    // await page.goto("https://www.kkrn.de/karriere/stellenangebote/?tx_fmkarriere_karriere%5Bcontroller%5D=Frontend&cHash=796a5ee3c9f4e29f77c466195b1bb05c")
    page.setDefaultNavigationTimeout(0);
    let allJobs = [];
    let allLinks = [
      "https://www.kkrn.de/karriere/stellenangebote/?tx_fmkarriere_karriere%5Bcontroller%5D=Frontend&cHash=796a5ee3c9f4e29f77c466195b1bb05c"
    ];
    let counter = 0;
    do {
      await page.goto(allLinks[counter], {
        timeout: 0
      });
      scroll(page);
      // get all job links

      const jobs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".title > h2 > a")).map(
          el => el.href
        );
      });

      allJobs.push(...jobs);
      counter++;
      // await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    console.log(allJobs);

    const allJobsDetails = [];

    for (let details of allJobs) {
      let job = {
        title: "",
        location: "Hervester Strasse 57  45768 Marl",
        hospital: "KKRN Catholic Clinic Ruhr Area North GmbH",
        link: "",
        level: "",
        position: "",
      };
      await page.goto(details);
      scroll(page);
      await page.waitForSelector("h3");

      let title = await page.evaluate(() => {
        let title = document.querySelector(".stelle.clear > h1");
        return title ? title.innerText : null;
      });

      job["title"] = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
      let position = text.match(/arzt|pflege/);
      job.level = level ? level[0] : "";
      if (
        level == "Facharzt" ||
        level == "Chefarzt" ||
        level == "Assistenzarzt"
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
      let applyLink = await page.evaluate( () =>{
          let apply = document.querySelector('div.applynow > a')
          return apply ? apply.href : null;
      })
     job.link = applyLink;
      allJobsDetails.push(job);
    }
    console.log(allJobsDetails);

    await page.close();
    await browser.close();
    return allJobsDetails.filter((job) => job.position != "");
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
  };
kkrnCatholic()


