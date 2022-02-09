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
let krankenhausNeuwerk = async () => {
  try {
    let browser = await puppeteer.launch({
      headless:false,
    });

    let page = await browser.newPage();

    await page.goto("https://wirsuchenmenschen.de/jobs/?jq=neuwerk&city=M%C3%B6nchengladbach#mode-grid", {
      waitUntil: "load",
      timeout: 0,
    });
 page.setDefaultNavigationTimeout(0)
    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.title > a")
      ).map((el) => el.href);
    });
  // await page.waitForTimeout(2000)
    // console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Krankenhaus Neuwerk \"Maria von den Aposteln\"",
        link: "",
        level: "",
        position: "",
        city: "Mönchengladbach",
        email: "",
        republic: "North Rhine-Westphalia",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      let title = await page.evaluate(() => {
        let jbtitle = document.querySelector('div.ce-bodytext > h1');
        return jbtitle ? jbtitle.innerText : null;
      });
      job.title = title;

      job.location = await page.evaluate(() => {
        let loc = document.querySelector('p.icon-text.icon-location ').innerText;
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
        return document.body.innerText.match(/[a-zA-Z0-9_+/.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]+/g);
      });
      if (typeof job.email == "object"){
        job.email = "" + job.email;
      };
    // apply Links 
    job.link = await page.evaluate( () => {
      let apply = document.querySelector('div.btn-group.job-links > a')
      return apply ? apply.href : null
    })
    await page.waitForTimeout(1000)
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




export default krankenhausNeuwerk;