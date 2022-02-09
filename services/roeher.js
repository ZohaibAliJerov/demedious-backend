import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const roeher = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();

  let url = "https://www.roeher-parkklinik.de/klinik/karriere/";
  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //scroll the page
  await scroll(page);
  await page.waitForTimeout(5000);

  //TODO:get titles
  let titles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".fusion-toggle-heading")).map(
      (el) => el.innerText
    );
  });
  console.log(titles);
  //get all job details
  let allJobs = [];
  for (let title of titles) {
    // await page.goto(link, { timeout: 0, waitUntil: "load" });
    // await page.waitForTimeout(5000);
    let job = {
      title: "",
      location:
        "ZAP – Center for Outpatient Psychotherapy,Röher Str. 55,52249 Eschweiler",
      hospital: "Röher Parkklinik",
      link: url,
      level: "",
      position: "",
      city: "Eschweiler",
      email: "",
      republic: "North Rhine-Westphalia",
    };
    await scroll(page);
    job.title = title;
    console.log(job.title);
    job.email = await page.evaluate(() => {
      return document.body.innerText.match(/\w+@.*\.\w/).toString();
    });

    let text = title;

    //get level and positions
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
  } //end of for loop
  await page.close();
  await browser.close();
  return allJobs;
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

// export default wessel;
(async () => {
  let res = await roeher();
  console.log(res);
})();
