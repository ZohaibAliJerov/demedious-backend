
import puppeteer from "puppeteer";

let positions = ["arzt", "pflege"];
let levels = ["Facharzt", "Chefarzt", "Assistenzarzt", "Arzt", "Oberarzt"];

let gfo_kliniken = async () => {
  try {
    let browser = await puppeteer.launch({
      headless: false,
    });

    let page = await browser.newPage();
let links = "https://jungbrunnenklinik.de/karriere/"
    await page.goto( links , {
      waitUntil: "load",
      timeout: 0,
    });

    await scroll(page);

    // //get all jobLinks
    // const jobLinks = await page.evaluate(() => {
    //   return Array.from(
    //     document.querySelectorAll(".joboffer_title_text.joboffer_box a")
    //   ).map((el) => el.href);
    // });

    // console.log(jobLinks);
    let allJobs = [];

    // for (let jobLink of jobLinks) {
      let job = {
        title: "",
        location: "",
        hospital: "Jungbrunnen-Klinik",
        link: "",
        level: "",
        position: "",
        city: "Bonn",
        email: "",
        republic: "North Rhine-Westphalia",
      };

    //   await page.goto(jobLink, {
    //     waitUntil: "load",
    //     timeout: 0,
    //   });

      await page.waitForTimeout(1000);
    //   let tit = 0;
    //   if(tit){
        let title = await page.evaluate(() => {
          let ttitle = document.querySelector("#et-boc > div > div > div.et_pb_section.et_pb_section_0.et_section_regular > div > div > div.et_pb_module.et_pb_blurb.et_pb_blurb_0.et_pb_text_align_left.et_pb_blurb_position_top.et_pb_bg_layout_light > div > div > div > p:nth-child(4)");
          return ttitle ? ttitle.innerText : "";
        });
        job.title = title;
    

      job.location = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.].+ \d+[\n][\n]\d+[a-zA-Z-. ].+|[a-zA-Z-.].+ \d+[\n]\d+[a-zA-Z-. ].+/) || ''
      });

      if(typeof job.location == 'object' && job.location != null ){
        job.location = job.location[0]
      }
   
      let text = await page.evaluate(() => {
        return document.body.innerText;
      });
      //get level
      let level = text.match(/Facharzt|Chefarzt|Assistenzarzt|Arzt|Oberarzt/);
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
        console.log('run')
      }

      //get link\

      job.email = await page.evaluate(() => {
        return document.body.innerText.match(/[a-zA-Z-.]+@[a-zA-Z-.]+|[a-zA-Z-.]+[(]\w+[)][a-zA-Z-.]+/) || "gborsum@dbkg.de"
      });
      if(typeof job.email == "object" && job.email != null ){
        job.email = job.email[0]
      }
      // job.email = email

      // get link 
      let link1 = 0;
      if (link1) {
        const link = await page.evaluate(() => {
          let applyLink = document.querySelector('.css_button a')
          return applyLink ? applyLink.href : ""
        })
        job.link = link;
      } else {
        job.link = links
      }



      allJobs.push(job);
    // }
    console.log(allJobs)
    await browser.close();
    return allJobs.filter((job) => job.position != "");
  } catch (e) {
    console.log(e);
  }
};

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
}
gfo_kliniken()
// export default gfo_kliniken


