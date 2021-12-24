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
const heliosKlinik_Duisburg = async () =>{
    try {
        const browser = await puppeteer.launch({
            headless: false
            })
        const page = await browser.newPage();
       await page.goto("https://www.helios-gesundheit.de/kliniken/duisburg-homberg/unser-haus/karriere/stellenangebote/")
        page.setDefaultNavigationTimeout(0);
       
        const jobLinks = [ ];
        let allUrls = [
            "https://www.helios-gesundheit.de/kliniken/duisburg-homberg/unser-haus/karriere/stellenangebote/",
            "https://www.helios-gesundheit.de/kliniken/duisburg-homberg/unser-haus/karriere/stellenangebote/?tx_heliosuwstemplates_jobsearch%5Baction%5D=list&tx_heliosuwstemplates_jobsearch%5Bcontroller%5D=Job&tx_heliosuwstemplates_jobsearch%5Bpage%5D=2&cHash=04211e08dfb0618daabe8481e361af61"
        ]
            // get all jobs links 
        for(let a=0;a<allUrls.length; a++) {
           await page.goto(allUrls[a])
           scroll(page);
        let jobs = await page.evaluate( ()=>{
            return  Array.from(document.querySelectorAll('.tabular-list__item > a'))
            .map((el) => el.href);
        })
        jobLinks.push(...jobs)
        };
        console.log(jobLinks);

        const alljobDetails = [ ];
        for (let details of jobLinks) {
            await page.goto(details)
            scroll(page)
            let job = {
                title: "",
                location: "Duisburg",
                hospital: "Malteser Krankenhaus St. Johannes-Stift",
                link: "",
                level: "",
                position: "",
              };;
            let title = await page.evaluate( () =>{
                let jobTitle = document.querySelector('div.billboard-panel__body > h2');
                return jobTitle ? jobTitle.innerText : null
            })
            job.title = title;
            
            let applyLink = await page.evaluate( () =>{
                let link = document.querySelector('.dialog__content > a')
                return link ? link.href : null
            })
            job.link = applyLink;

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
                level == "Assistenzarzt"
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
            alljobDetails.push(job)
        }
        console.log(alljobDetails);
        await browser.close();
        // await page.close();
        return alljobDetails.filter((job) => job.position != "");

    } catch (err) {
        console.error(err)
    }
}
heliosKlinik_Duisburg()