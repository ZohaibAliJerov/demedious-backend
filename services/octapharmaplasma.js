import puppeteer from "puppeteer";

const octapharmaplasma = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false });
    let page = await browser.newPage();
    let url = "https://www.octapharmaplasma.de/jobs";

    //visit the site
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    //scroll the page
    await page.evaluate(() => {
      for (let i = 0; i < 100; i++) {
        if (
          document.scrollingElement.scrollTop + window.innerHeight >=
          document.scrollingElement.scrollHeight
        ) {
          break;
        }
        document.scrollingElement.scrollBy(0, 100);
        setTimeout(1000);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
