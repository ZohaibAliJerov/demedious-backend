import puppeteer from "puppeteer";

(async ()=> {
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto("https://www.lwl-therapiezentrum-marsberg.de/de/job-karriere/", {waitUntil: 'load', timeout : 0})


    // // contact and address scrape and stored in and array
    // const addresscon = await page.evaluate(() =>

    // Array.from(document.querySelectorAll("p.adressData")).map((e) => e.innerText));

    //     console.log(addresscon) 
    // click to appy button 

    // const clickButton = await page.click('a[href="https://recruiting.lwl.org/r/z11rvmk4ipw44b4/Assistenz%C3%A4rztinAssistenzarzt+oder+Fach%C3%A4rztinFacharzt+mwd/34431/Marsberg"]')

    //     console.log(clickButton)
    
    await page.screenshot({path : "lwl.png"});
    
    // await page.click( 'a[href=https://recruiting.lwl.org/r/z01tv1pjx0upx7w/Assistenz%C3%A4rztinAssistenzarzt+oder+Fach%C3%A4rztinFacharzt+mwd/34431/Marsberg]')

    // 

    await browser.close();
})()