import puppeteer from "puppeteer";
import {scroll} from "./pageScroll.js";

const stellenausschreibungen = async () =>{
          try {
            const browser = await puppeteer.launch({
                headless: false
                })
            const page = await browser.newPage();
           await page.goto(
               "https://karriere.katharina-kasper-gruppe.de/stellenangebote.html?filter%5Borg_einheit%5D=16"
               )
            page.setDefaultNavigationTimeout(0);
        } catch (err) {
            console.error(err)
        }
    }