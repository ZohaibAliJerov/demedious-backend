
import puppeteer from "puppeteer";

let positions = [
    "arzt",
     "pflege"
    ];
let levels = [
    "Facharzt", 
    "Chefarzt", 
"Assistenzarzt"
 ];
 const klinikfur_Rehabilitation = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto(
           "https://www.wirpflegen.de/karriere/stellenangebote/ort/bad-oeynhausen/v/liste/j/city/nw-Bad%2520Oeynhausen?cHash=0efd8abceef8ff54a7feac73f84f1516#joResults"
           );
        page.setDefaultNavigationTimeout(0);
       
        const jobLinks = [ ];
        let allUrls = [
            "https://www.wirpflegen.de/karriere/stellenangebote/ort/bad-oeynhausen/v/liste/j/city/nw-Bad%2520Oeynhausen?cHash=0efd8abceef8ff54a7feac73f84f1516#joResults"
             ]
            // get all jobs links 
        for(let a=0;a<allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll(' div.item p > a')
            ).map((el) => el.href);
        })
        jobLinks.push(...jobs)
        }
        await page.waitForTimeout(3000);
        console.log(jobLinks);

        await browser.close();
        // await page.close();
        // return alljobDetails.filter((job) => job.position != "");
      
    } catch (err) {
        console.error(err)
    }
}
export async function scroll(page) {
    await page.evaluate(() => {
        const distance = 100;
        const delay = 100;
        const timer = setInterval(() => {
            document.scrollingElement.scrollBy(0, distance);
            if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
                clearInterval(timer);
            }
        }, delay);
    });
}


