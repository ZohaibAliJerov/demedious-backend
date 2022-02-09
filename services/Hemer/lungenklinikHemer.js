import puppeteer from "puppeteer";
let positions = [
    "arzt",
     "pflege"
    ];
let levels = [
    "Facharzt", 
    "Chefarzt", 
"Assistenzarzt",
"Arzt", "Oberarzt"
 ];
const lungenklinik_Hemer = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            });
        const page = await browser.newPage();
       await page.goto(
           "https://www.lungenklinik-hemer.de/leistungen-angebote/stellenangebote-ausbildung/"
           );
        page.setDefaultNavigationTimeout(0);

        const jobLinks = [ ];
        let allUrls = [
            "https://www.lungenklinik-hemer.de/leistungen-angebote/stellenangebote-ausbildung/"
        ]
            // all jobsLinks 
        for(let a=0;a<allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let job = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('p.multijobs-readmorelink > a'))
            .map((el) => el.href);
        })
        jobLinks.push(...job)
        }
        console.log(jobLinks);
        await page.waitForTimeout(3000);
       let jobDetails = [ ];

       for (let links of jobLinks){
           await page.goto(links);
           let job = {
            title: "",
            location: " Hemer",
            hospital: "Lungenklinik Hemer",
            link: "",
            level: "",
            position: "",
          };
           scroll(page);

           let title = await page.evaluate( () => {
               let jobTitle = document.querySelector('div.et_pb_code_inner > h2');
               return jobTitle ? jobTitle.innerText : null
           })
           job.title = title;

           let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //get level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
          let position = text.match(/arzt|pflege/);
          job.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt" ||
            level == "Arzt" ||
            level == "Oberarzt"
          ) {
            job.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            job.position = "pflege";
            job.level = "Nicht angegeben";
          }
    
          if (!position in positions) {
            continue;
          }
    
          //get link
          let link = await page.evaluate(() => {
            return document.body.innerText.match(/[A_Za-z0-9-._+/]+@[A_Za-z0-9-._+/]+\.[A_Za-z0-9-]+/g);
          });
          if (typeof link == "object") {
            job.link = {...link}
          }
          
           jobDetails.push(job)
          await page.waitForTimeout(4000)
       }

       console.log(jobDetails);

        await browser.close();
        // await page.close();
    return jobDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err)
    }
};


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

export default lungenklinik_Hemer;
