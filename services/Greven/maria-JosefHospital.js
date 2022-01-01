import puppeteer  from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt"];
const mariaJosefHospital = async () =>{
    try {
        const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(
          "https://www.maria-josef-hospital.de/karriere/stellenmarkt.html"
          );
      page.setDefaultNavigationTimeout(0);
      let allJobs = [ ];
      let allLinks = [ 
          "https://www.maria-josef-hospital.de/karriere/stellenmarkt.html"
         ];
      let count = 0;
      do {
        await page.goto(allLinks[count]);
        scroll(page);
      //  get all job links
  
        let jobs = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll('div.media > h3 > a')
            ).map((el) => el.href);
        });
        allJobs.push(...jobs);
        count++;
      }
       while (count < allLinks.length);
       console.log(allJobs);
       let jobDetails = [ ]
       for (let href of allJobs) {
          await page.goto(href)
          scroll(page)
          let josefHospital = {
            title: "",
            location: "Greven",
            hospital: "MARIA-JOSEF-HOSPITAL GREVEN",
            link: "",
            level: "",
            position: "",
          };

          let title = await page.evaluate(  () => {
            let jobTitle = document.querySelector('.header > h2');
            let jobTitle1 = document.querySelector('div.article > h3')
            return jobTitle?.innerText || jobTitle1.innerText;
          })
          josefHospital.title = title;
          let text = await page.evaluate(() => {
            return document.body.innerText;
          });
          //level
          let level = text.match(/Facharzt|Chefarzt|Assistenzarzt/);
          let position = text.match(/arzt|pflege/);
          josefHospital.level = level ? level[0] : "";
          if (
            level == "Facharzt" ||
            level == "Chefarzt" ||
            level == "Assistenzarzt"
          ) {
            josefHospital.position = "artz";
          }
          if (position == "pflege" || (position == "Pflege" && !level in levels)) {
            josefHospital.position = "pflege";
            josefHospital.level = "Nicht angegeben";
          }
    
          if (!position in positions) {
            continue;
          }
          let applyLink = await page.evaluate( () => {
            let link = document.querySelector('a.external-link');
            return link ?  link.href : null;
          })
          josefHospital.link = applyLink;
         
          await page.waitForTimeout(5000)
          jobDetails.push(josefHospital)
       }
       console.log(jobDetails);


        await browser.close()
        // await page.close()
        return jobDetails.filter((job) => job.position != "");
    } catch (err) {
        console.error(err);
    }

}

async function scroll(page) {
    await page.evaluate(() => {
      const distance = 100;
      const delay = 100;
      const timer = setInterval(() => {
        document.scrollingElement.scrollBy(0, distance);
        if (
          document.scrollingElement.scrollTop + window.innerHeight >=
          document.scrollingElement.scrollHeight
        ) {
          clearInterval(timer);
        }
      }, delay);
    });
  };


  
