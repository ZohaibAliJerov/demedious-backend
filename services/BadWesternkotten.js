import puppeteer from "puppeteer";
(async function () {
  try {
    const URL = "https://www.klinik-wiesengrund.de/aktuelle-stellenangebote/";
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(URL);

    //get job titles
    let title = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".hc_blog_post_content h2")
      ).map((el) => el.innerText);
    });
    // console.log(jobsTitle)


    //get location
    let originalLocation = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".hc_blog_post_content p")
      ).map((el) => el.innerText);
    });
    let location = originalLocation[10];

    // console.log(location)

    //get email
    let email = await page.evaluate(() => {
      let emailRegex = /in[A-Za-z]+@[A-Za-z]+-?[A-Za-z]+.?de?/;
      let Originalmail = Array.from(document.querySelectorAll(".textwidget p"));
      Originalmail = Originalmail.map((el) => el.innerText);
      let emails = Originalmail.join(" ");
      emails = emails.match(emailRegex);
      return emails;
    });
    // console.log(email);
    
    //get job contactNo
    let contactNumbers = await page.evaluate(() => {
      let numberRegex = /\d+.\d+/;
      let num = Array.from(document.querySelectorAll(".textwidget p"));
      num = num.map((el) => el.innerText);
      let numbr = num.join(" ");
      numbr = numbr.match(numberRegex);
      return numbr;
    });
    // console.log(contactNumbers);

    let allJobs = [title, location, email, contactNumbers];
    // Job details
    let jobDetails = {
      title,
      location,
      email,
      contactNumbers,
    };

    allJobs.push(jobDetails);
    console.log(jobDetails);
    // console.log(allJobs)

    await browser.close();
    return allJobs;
  } catch (error) {
    console.error(error);
  }

  await page.waitForTimeout(3000);
})();
