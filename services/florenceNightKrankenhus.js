import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let florencNightKrank = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
    let alljobsLinks = [];

    let allLinks = [
        "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%27a%3D0%27",
        "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%27a%3D0%27&tx_ttnews%5Bpointer%5D=1&cHash=5acac32e6cd26b46843fc7ce24f87062",
        "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%27a%3D0%27&tx_ttnews%5Bpointer%5D=2&cHash=e9db8017b61c163e555efe7db57bdcc4"
    ]


    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      //get all job links
      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("h2.entry-title.fusion-post-title a")
        ).map((el) => el.href);
      });
      alljobsLinks.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
 while (counter < allLinks);
    //console.log(allJobs);

    console.log(alljobsLinks);

    let allJobs = [];

    for (let jobLink of alljobsLinks) {
      let job = {
        title: "",
        location: "Solingen",
        hospital: "Psychosoziale Trägerverein Solingen, Standort Eichenstraße",
        link: "",
        level: "",
        position: "",
      };

      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);

      let title = await page.evaluate(() => {
        let ttitle = document.querySelector(".tahoma-blue");
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
        let applyLink = document.querySelector('.internal-link.button-blau');
        return applyLink ? applyLink.href : "";
      });
        job.link = link;
    
      // console.log(job);
      allJobs.push(job);
    }
    console.log(allJobs)
    await browser.close();
    await page.close()
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

florencNightKrank()
// export default aatalklinik;
