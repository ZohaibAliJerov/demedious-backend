import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt","Arzt", "Oberarzt"];

let werdohol = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto("https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5BJobListNr%5D=10&cmd=listView",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=3&cHash=0e4f94fb45beba303acc71c46a969db9",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=4&cHash=c945119f8c1d377c95ef5b7f83b1531e",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=5&cHash=009147f8b81741c916167214815ddd25",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=6&cHash=cc8a14e03d306c0c8874a3d93a7c0d3e",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=7&cHash=8179c4af975e60a5c4a40d0b30cb99e7",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=8&cHash=399546d1125bbbc82de22b4d19abba31",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=9&cHash=c1a3bd14ef52f57fdae440080192653c",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=10&cHash=8958afe3dd0cf2abf2db93f35fa023d8",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=11&cHash=3670e87b480aa51f1188128f2a3eda09",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=12&cHash=fcfbba5a2c1c051083537d8b166000d6",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=13&cHash=6660237e2d84b165c0a1572e0a740f33",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=14&cHash=e26f136de2a44e1ff1f471d4875805b3",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=15&cHash=356df6d99ceca33c216cda5a2aa8d5f0",
    "https://www.maerkische-kliniken.de/holding/stellenangebote.html?tx_asjobboerse_pi1%5Bpage%5D=16&cHash=560ccf5fb117ea1a12a450f7ed1cc4ef",
    "",
    "",
     {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    //get all jobLinks
    const jobLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".listitem_text > p > strong > a")).map(
        (el) => el.href
      );
    });

    console.log(jobLinks);
    let allJobs = [];

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Werdohl",
        hospital: "Stadtklinik Werdohl ",
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
        let ttitle = document.querySelector(".stellenangebote_sp1.span_8 > h1");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

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
        level == "Assistenzarzt"||
        level =="Arzt"||
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
      let link = await page.evaluate(() => {
        let lnk = document.querySelector(".bodytext > a");
        return lnk ? lnk.href : "";
      });
      job.link = link;
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
werdohol();
export default werdohol;