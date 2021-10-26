import puppeteer from "puppeteer";

(async ()=> {
    const browser = await puppeteer.launch({
        headless: true
       
    });
    const page = await browser.newPage();
    await page.goto('https://www.lwl-therapiezentrum-marsberg.de/de/job-karriere/',{waitUntil: 'domcontentloaded'});
    // const example  = await page.$('.regionIndex');
    const scrapedData = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.article-text > p > a'))
      .map(link => ({
        title: link.innerHTML,
        link: link.getAttribute('href')
      }))
    )
  console.log('scrapedData',scrapedData);
    await page.close()
    await browser.close();
  

})();
