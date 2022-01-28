import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const elisabeth = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(
      "https://www.elisabethgruppe.de/untermenue/karriere-bildung/jobportal-stellenangebote.html",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    //shutt the dialog
    await page.waitForSelector(
      "button#uc-btn-accept-banner.uc-btn-new.uc-btn-new.uc-btn-accept"
    );
    await page.click(
      "button#uc-btn-accept-banner.uc-btn-new.uc-btn-new.uc-btn-accept"
    );
    await page.waitForTimeout(5000);

    let allPageLinks = [];

    let pages = await page.evaluate(() => {
      let links = Array.from(document.querySelectorAll("div.liste_seiten > a"));
      links = links.map((el) => {
        return el.href;
      });
      return links;
    });
    //    console.log(pages);
    pages = pages.slice(1, pages.length);
    allPageLinks.push(...pages);

    //    console.log(allPageLinks);

    let allJobLinks = [];
    let allLocations = [];
    //get all joblinks
    for (let pageLink of allPageLinks) {
      //visit each page
      await page.goto(pageLink, {
        waitUntil: "load",
        timeout: 0,
      });

      //scroll down
      await scroll(page);

      //select jobs and take urls
      let JobLinks = await page.evaluate(() => {
        return [
          ...document.querySelectorAll("span.headerlink.stellenlink > a"),
        ].map((job) => job.href);
      });
      allJobLinks.push(...JobLinks);
      let locations = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("span.kurzb")).map(
          (el) => el.innerText
        );
      });

      await page.waitForTimeout(3000);
    }
    //    console.log(allJobLinks);
    let allJobs = [];
    for (let jobLink of allJobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "St. Anna Hospital Herne ",
        link: "",
        level: "",
        position: "",
        city: "Herne",
        email: "",
        republic: "North Rhine-Westphalia",
      };
      //visit each job link
      await page.goto(jobLink, { waitUntil: "load", timeout: 0 });
      //   await page.waitForTimeout(1000);

      scroll(page);
      await page.waitForTimeout(5000);

      //get title
      job.title = await page.evaluate(() => {
        let selector1 = document.querySelector("div#con_1 > font > font");
        let selector2 = document.querySelector("div#con_1");

        return selector1?.innerText || selector2?.innerText;
      });

      await page.waitForSelector("span#probew > a");
      job.link = await page.evaluate(() => {
        let link = document.querySelector("span#probew > a ");
        return link ? link.href : null;
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

      allJobs.push(job);
    }

    console.log(allJobs);
    await browser.close();
  } catch (err) {
    console.log(err);
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
elisabeth();
//export default elisabeth;
