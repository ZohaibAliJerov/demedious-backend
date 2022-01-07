import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

const paracelsus = async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();

  let url = "https://jobs.pkd.de/category/adorf-schoeneck/5559";

  await page.goto(url, { timeout: 0, waitUntil: "load" });

  //TODO:scroll the page
  await scroll(page);
  //TODO:get all job links
  let links = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".module.moduleItems.hasShonts > a ")
    ).map((el) => el.href);
  });
  //TODO:get all job details
  let allJobs = [];
  for (let link of links) {
    await page.goto(link, { timeout: 0, waitUntil: "load" });
    await page.waitForTimeout(5000);
    for (let link of links) {
      let job = {
        title: "",
        location: "Düsseldorf",
        hospital: "Paracelsus-Klinik Golzheim",
        link: "",
        level: "",
        position: "",
      };
      job.title = await page.evaluate(() => {
        return document.querySelector("h1").innerText;
      });



  }//end of for loop
  await page.close();
  await browser.close();
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

(async () => {
  let res = await paracelsus();
  console.log(res);
})();
