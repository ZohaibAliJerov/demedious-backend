import puppeteer from "puppeteer";

const koAesthetics_Dusseldorf = async () =>{
   let browser = await puppeteer.launch(
     { headless: true }
     );
  let page = await browser.newPage();
  await page.goto(
    "https://www.koe-klinik.de/koe-klinik/karriere-bei-koe-klinik.html",
     { timeout: 0,
       waitUntil: "load" 
      });
  // page.waitForTimeout(3000);

  //get all jobs
  await page.evaluate(() => {
    let jobCollection = [];
    let jobs = Array.from(
        document.querySelectorAll("div.nxs-accordionTrigger")
    );
    for (let job of jobs) {
        for (let i = 0; i < 2 * i; i++) {
          document.scrollingElement.scrollBy(0, 100);
          setTimeout(1000);
        }
        job.click();
        let title = job.innerText;
  
        // let location = document
        //   .querySelector(
        //     "div.elementText.elementText_var0.elementTextListStyle_var0.first-child > p"
        //   )
        //   .innerText.split("\n")[0];
        // let cell = document.querySelector(
        //   ".elementText.elementText_var0.elementTextListStyle_var0.first-child.last-child > p > strong > a"
        // ).innerText;
        // if (typeof cell == "object" && cell == null) {
        //   cell = cell[0];
        // } else if (cell == null) {
        //   cell = "";
        // }
  
        // let email = "";
        // let applyLink = document
        //   .querySelector(".elementLink.elementLink_var10.isInverseBackground > a")
        //   .onclick();
        jobCollection.push({ title });
      }
      console.log(jobCollection);
      return jobCollection;
    });
    
    await browser.close()
    // await page.close();
};

koAesthetics_Dusseldorf();
