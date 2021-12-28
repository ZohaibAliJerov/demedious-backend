
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


