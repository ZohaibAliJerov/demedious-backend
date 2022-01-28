import puppeteer from "puppeteer";
let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];
const krankenhausder_Augustin = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();
    const jobLinks = [];
    let allUrls = [
      "https://www.severinskloesterchen-karriere.de/stellenangebote/",
    ];
    // all jobsLinks
    for (let a = 0; a < allUrls.length; a++) {
      await page.goto(allUrls[a]);
      scroll(page);
      let job = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("li.filter > a")).map(
          (el) => el.href
        );
      });
      jobLinks.push(...job);
    }
    await page.waitForTimeout();
    console.log(jobLinks);
    let allJobs = [];
    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Köln",
        hospital: 'Krankenhaus der Augustinerinnen "Severinsklösterchen"',
        link: "",
        level: "",
        position: "",
        email: "",
        city: "Köln",
        republic: " Weimar",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("div.bewerbung-title > h1");
        return ttitle ? ttitle.innerText : null;
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
        let link = document.querySelector("a.button-jetzt-bewerben");
        return link ? link.href : null;
      });
      job.link = link;
      let email = await page.evaluate(() => {
        // let mail =  document.body
        let mail1 = document.querySelector("a.mail");
        // return  hrefs.href || mail.innerText.match(/[a-zA-Z0-9-._+/]+@[a-zA-Z0-9-._+/]+\.[a-zA-Z0-9-]+/g)
        return mail1
          ? mail1.href.match(
              /[a-zA-Z0-9-._+/]+@[a-zA-Z0-9-._+/]+\.[a-zA-Z0-9-]+/g
            )
          : null;
      });
      job.email = email;
      if (typeof email == "object") {
        job.email = "" + email;
      }
      // console.log(job);
      allJobs.push(job);
    }
    console.log(allJobs);
    await browser.close();
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
      if (
        document.scrollingElement.scrollTop + window.innerHeight >=
        document.scrollingElement.scrollHeight
      ) {
        clearInterval(timer);
      }
    }, delay);
  });
}

export default krankenhausder_Augustin;
