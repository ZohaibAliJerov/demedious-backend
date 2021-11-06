import puppeteer from "puppeteer";

async function getJobs(params) {
  const URL = "https://www.beethoven-klinik-koeln.de/?s=jobs";

  const allJobsDetails = [];

  try {
    console.log("Trying to scrape *************");
    const browser = await puppeteer.launch({
      headless: false,
    });

    const [page] = await browser.pages();
    await page.goto(URL);

    // Get job urls
    const job_Urls = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("header.entry-header h1.entry-title a"),
        (jobLinks) => jobLinks.href
      )
    );

    console.log(job_Urls);

    const jobsTitle = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("header.entry-header h1.entry-title"),
        (jobtitles) => jobtitles.innerText
      )
    );
    console.log(jobsTitle);

    let counter = 0;
    do {
      await page.goto(job_Urls[counter], { timeout: 0 })
    

      const jobDetails = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll("div.entry-content > ul > li"),
        (jobdet) => jobdet.innerText
      )
    );
    
    jobDetails.slice(0,3);
    console.log(jobDetails);

      counter++;
      await page.waitForTimeout(3000);

      // console.log(jobsTitle)

    } while (counter < job_Urls.length);
    await browser.close();
  } catch (err) {
    console.log(err);
  }
}
getJobs();

// async function getJobs(params) {
//   const URL = "https://www.beethoven-klinik-koeln.de/?s=jobs";

//   try {
//     console.log("Trying to scrape *************");
//     const browser = await puppeteer.launch({
//       headless: false,
//     });
//     const [page] = await browser.pages();
//     await page.goto(URL);
//     // await page.waitForSelector('#createAlertPop');

//     const urls = await page.evaluate(() =>
//       Array.from(
//         document.querySelectorAll("header.entry-header h1.entry-title a"),
//         (link) => link.href
//       )
//     );

//     // console.log(urls);
//     const p_urls = [];
//     p_urls.push(urls);
//     console.log(p_urls);
//     const zipRecruiterJobs = [];

//     for (const url of urls) {
//       await page.goto(url);
//       if (
// !page.url().startsWith("https://www.beethoven-klinik-koeln.de/karriere")
//       )
//         continue;
//       await page.waitForSelector("header.entry-header h1.entry-title");
//       // Get the data you want here and push it into the data array

//       const linksData = await page.evaluate(() =>
//         Array.from(
//           document.querySelectorAll("div.content-area ul"),
//           (ldata) => ldata.innerText
//         )
//       );

//       console.log(linksData);

//       zipRecruiterJobs.push(
//         await page.evaluate(
//           () =>
//             document.querySelector("header.entry-header h1.entry-title")
//               .innerText
//         )
//       );
//     }

// await browser.close();
//     console.log(zipRecruiterJobs);
//     return zipRecruiterJobs;
//   } catch (err) {
//     console.log("There is an error, please check again");
//   }
// }

// getJobs();
