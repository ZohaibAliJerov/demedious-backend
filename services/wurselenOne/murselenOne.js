import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let murselenOne = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });
    let page = await browser.newPage();

    await page.goto(
      "https://karriere.via.life/jobs-in-aachen/",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    let nextPage = true;
    let allJobLinks = [];
    while (nextPage) {
      //scroll the page
      await scroll(page);

      await page.waitForTimeout(1000);
      //get all jobLinks
      let jobLinks = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            "#content > article > div > div > div > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-488c5567.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div > div > div.elementor-element.elementor-element-11200e2f.elementor-widget.elementor-widget-shortcode > div > div > div > ul > li.post-3618.job_listing.type-job_listing.status-publish.has-post-thumbnail.hentry.entry.has-media.job-type-teilzeit > a"
          )
        ).map((el) => el.href);
      });
      allJobLinks.push(...jobLinks);
      await page.waitForTimeout(1000);
      let bottomNextLink = await page.evaluate(() => {
        return document.querySelector(
          "#content > article > div > div > div > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-488c5567.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div > div > div.elementor-element.elementor-element-11200e2f.elementor-widget.elementor-widget-shortcode > div > div > div > a"
        );
      });
      if (bottomNextLink) {
        await page.click(
          "#content > article > div > div > div > div > section.elementor-section.elementor-top-section.elementor-element.elementor-element-488c5567.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div > div > div.elementor-element.elementor-element-11200e2f.elementor-widget.elementor-widget-shortcode > div > div > div > a"
        );
        nextPage = true;
      } else {
        nextPage = false;
      }
    } //end of while loop

    console.log(allJobLinks);

    let allJobs = [];

    for (let jobLink of allJobLinks) {
      let job = {
        title: "",
        location: "Aachen",
        hospital: "VIALIFE Campus Bardenberg",
        city: "Würselen",
        link: "",
        level: "",
        email: "",
        position: "",
        republic: "North Rhine-Westphalia",
      };
      await page.goto(jobLink, {
        waitUntil: "load",
        timeout: 0,
      });

      await page.waitForTimeout(1000);
      //get title
      let title = await page.evaluate(() => {
        let ttitle = document.querySelector("h1.page-header-title.clr");
        return ttitle ? ttitle.innerText : "";
      });
      job.title = title;

      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get email
      let email = await page.evaluate(() => {
        return  document.body.innerText.match(/\w+\@\w+.\w+/) || "N/A";
      });
      job.email = String() + email;
      //apply link
      job.link = jobLink;
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
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
murselenOne();
export default murselenOne;
