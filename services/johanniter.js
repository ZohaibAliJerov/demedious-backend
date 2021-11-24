import puppeteer from "puppeteer";

const johanniter = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let url =
      "https://www.johanniter.de/johanniter-kliniken/neurologisches-rehabilitationszentrum-godeshoehe/karriere/";

    await page.goto(url);
  } catch (error) {
    console.log(error);
  }
};
