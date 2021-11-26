import puppeteer from "puppeteer";



const recruiting = () => {
    
    try {
        let browser = await puppeteer.launch({ headless: false });
        let page = await browser.newPage();
        
    } catch () {
        
    }
}