import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const klinikSorpesee = async () => {
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();

  const url = "https://www.klinik-sorpesee.de/karriere/stellenangebote/";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  page.waitForTimeout(3000);

  //get all job links
  await page.evaluate(() => {
    let jobCollection = [];
    let jobLinks = Array.from(
      document.querySelectorAll(
        "h3.accordionHeader.accordionHeaderCollapsible.accordionHeaderHidden"
      )
    );

    for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "Sundern (Sauerland)",
        hospital: "Neurologische Klinik Sorpe",
        link: "",
        level: "",
        position: "",
      };

      for (let i = 0; i < 2 * i; i++) {
        document.scrollingElement.scrollBy(0, 100);
        setTimeout(1000);
      }

      jobLink.click();
      //get title
      job.title = jobLink.innerText;
      let text = document.body.innerText;
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

      //get applyLink
      job.link = document
        .querySelector(".elementLink.elementLink_var10.isInverseBackground > a")
        .onclick();
      jobCollection.push({ title, location, cell, email, applyLink });
    }

    return jobCollection;
  });
};

// export default klinikSorpesee;

(async () => {
  let res = await klinikSorpesee();
  console.log(res);
})();
