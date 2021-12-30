/**
 * first service
 */
import puppeteer from "puppeteer";

const florenceService = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    //scroll the page
    let allJobs = [];
    let allLinks = [
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%27a%3D0%27a%3D0%3Fref%3Dausbildungsatlas",
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%2527a%3D0chash%3D3b4262abd33953cbcab28989398ca953&tx_ttnews%5Bpointer%5D=1&cHash=5acac32e6cd26b46843fc7ce24f87062",
      "https://www.florence-nightingale-krankenhaus.de/de/karriere/stellenausschreibungen.html?type=0%25252525252527A%2525253D0&tx_ttnews%5Bpointer%5D=2&cHash=e9db8017b61c163e555efe7db57bdcc4",
    ];
    let counter = 0;
    do {
      await page.goto(allLinks[counter], { timeout: 0 });
      scroll(page);
      //get all job links

      let jobs = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("div.news-list-item.clearfix > h2 > a")
        ).map((el) => el.href);
      });
      allJobs.push(...jobs);
      counter++;
      await page.waitForTimeout(3000);
    } while (counter < allLinks.length);
    //console.log(allJobs);
    let allJobDetails = [];
    //get data from every job post
    for (let i = 0; i < allJobs.length; i++) {
      let job = {};
      await page.goto(allJobs[i]);
      scroll(page);
      await page.waitForSelector("h2");
      let title = await page.evaluate(() => {
        let title = document.querySelector("h2");
        return title ? title.innerText : null;
      });
      job["title"] = title;
      let text;
      let location = await page.evaluate(() => {
        let paragraphs = Array.from(document.querySelectorAll("p"));
        let loc = paragraphs[0];
        for (let i = 0; i < paragraphs.length; i++) {
          let maxChilds = paragraphs[i];
          if (loc.childElementCount < maxChilds.childElementCount) {
            loc = maxChilds;
          }
        }
        return loc ? loc.innerText : null;
      });

      job["location"] = location;

      let cell = await page.evaluate(() => {
        let text = Array.from(document.querySelectorAll("p")).map(
          (el) => el.innerText
        );
        // text = text.join(",");
        let regex =
          /\+\d+\s+\W0\W\s+\d+\s+\/\s+\d+-\d+\s+\/\s+\d+|\d+\s+\/\s+\d+-\d+|\d+\/d+-\d+\/\d+|\d+\/\d+-\d+|\d+\s+\d+|\d+\s\d+-\d+/g;
        let cell = text.filter((el) => el.match(regex));
        cell = cell.join(",").match(regex);
        return cell ? cell.filter((el) => el.includes("\n") == false) : "";
      });
      if (typeof cell == "object" && cell != null) {
        cell = cell[0];
      } else if (cell == null) {
        cell = "";
      }
      job["cell"] = cell;
      let email = await page.evaluate(() => {
        let mail = document.querySelector("a.mail");
        return mail ? mail.innerText : "";
      });
      if (typeof email == "object") {
        email = email[0];
      } else if (email == null) {
        email = "";
      }
      job["email"] = email;

      let applyLink = await page.evaluate(() => {
        let link = document.querySelector("a.internal-link.button-blau");
        return link ? link.href : "";
      });
      if (typeof applyLink == "object" && cell != null) {
        applyLink = applyLink[0];
      } else if (applyLink == null) {
        applyLink = "";
      }
      job["applyLink"] = applyLink;

      allJobDetails.push(job);
    }
    //    console.log(allJobDetails);
    await page.close();
    return allJobDetails;
  } catch (err) {
    console.log(err);
  }
};

//
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

export default florenceService;
