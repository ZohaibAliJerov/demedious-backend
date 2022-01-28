import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let good = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();

    await page.goto("https://www.krankenhaus-beckum.de/karriere/fuer-bewerber.html", {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".media-body a")
      ).map((el) => el.href);
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        city: "beckum",
        title: "",
        location: "beckum",
        hospital: "St. Elisabeth-Hospital beckum",
        link: "",
        level: "",
        position: "",
        republic: "North Rhine-Westphalia",
        email: ""
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h2");
        return ttitle ? ttitle.innerText : null;
      });
      job.title = title;
 // get email
 job.email = await page.evaluate(() => {
 return document.body.innerText.match(/[a-zA-Z-. ]+[(]\w+[)][a-zA-Z-. ]+/);

});

// get location
job.location = await page.evaluate(() => {
let loc = document.querySelector("#c33970").innerText;
loc = loc.replace("\n", " ");
return loc.replace(/[a-zA-Z-.].+ \d+[\n]\d+ [a-zA-Z-.].+/, "");
});  
      let text = await page.evaluate(() => {
        return document.body.innerText; 
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/|"Arzt"|"Oberarzt");
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
      
      // get link
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector('.media-body a')
          return applyLink ? applyLink.href : ""
        })
        job.link = link;
      } else {
        job.link = jobLink
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

good()





