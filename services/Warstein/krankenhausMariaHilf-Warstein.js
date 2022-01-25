import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
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
let krankenhausMariaHilf_Warstein = async () => {
  try {
    let browser = await puppeteer.launch({
      headless:false,
    });
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.goto(
      "https://www.krankenhaus-warstein.de/stellenangebote",
       {
      waitUntil: "load"
    });
    await scroll(page);
    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      let url =  Array.from(document.querySelectorAll("div.dvinci-job-entry.well.well-sm > a")
      ).map((el) => el.href);
      return url;
    });
    await page.waitForTimeout(2000)
    console.log(jobLinks);

    let allJobs = [];
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Krankenhaus Maria Hilf Warstein",
        link: "",
        level: "",
        position: "",
        city: "Warstein",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      let title = await page.evaluate(() => {
        let jbtitle = document.querySelector('div#liquidDesignPositionPublication  > h1')
        return jbtitle ? jbtitle.innerText : "";
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector('ul.list-inline > li:nth-child(1)').innerText;
        loc = loc.replace("\n", " ");
        return loc.replace(/\w+@\w+\.\w+/, "");
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
        return document.body.innerText.match(/\w+@\w+\.\w+/);
      });
      if (typeof job.email == "object") {
        job.email = "" + job.email;
      }
      let link = await page.evaluate(() => {
        let apply = document.querySelector('a.btn.btn-primary')
        return apply ? apply.href : null;
    })
      job.link = link;
    await page.waitForTimeout(3000)
      allJobs.push(job);
    }
    await page.waitForTimeout(3000)
    console.log(allJobs);
    await browser.close()
    // await page.close()
    return allJobs.filter((job) => job.position != "");
  } catch (err) {
    console.error(err);
  }
};


