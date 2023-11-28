const puppeteer = require('puppeteer');
const fs = require('fs');

async function getBrand() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.chrono24.fr/rolex/index.htm');
    await page.click('.js-cookie-accept-all'); // Accepts the cookies

    function sleep(number) {
        return new Promise((resolve) => setTimeout(resolve, number));
    }

    await sleep(200);
    await page.click('.select-like-button'); // Clicks on the select button

    // Wait for the data to load (adjust the selector and wait time accordingly)
    await page.waitForSelector('.filter-options .pointer', {timeout: 5000});

    // Retrieve the data using page.evaluate
    const brandData = await page.evaluate(() => {
        // Modify the selector to match the actual elements containing the data
        const brandElements = document.querySelectorAll('.filter-options .pointer'); //retrieve all the brands name
        const brands = [];
        for (const element of brandElements) {
            brands.push(element.innerText);
        }
        return brands;
    });
    let brandDict = {};
    brandData.map((brand) => { //split the brand name and the number of watches
        const [namePart, numberPart] = brand.split(' (');
        const name = namePart.trim();
        brandDict[name] = numberPart.replace(')', '');
    });
    await browser.close();
    //write the dictionary in a json file
    fs.writeFile('brands.json', JSON.stringify(brandDict), function (err) {
        if (err) throw err;
        console.log('Brands has been Saved!');
    });
}

brands = getBrand();

