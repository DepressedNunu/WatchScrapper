const puppeteer = require('puppeteer');
const fs = require('fs');
const brand = require('./brands.json');

export async function applyFilters(position) {
    console.log("Position is: " + position);
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto('https://www.chrono24.fr/rolex/index.htm');
    await page.click('.js-cookie-accept-all'); // Accepts the cookies

    await page.click('.select-like-button'); // Clicks on the select button
    await page.waitForSelector(".col-xs-24.col-sm-12.col-lg-8", {timeout: 5000}); // Wait for the data to load
    await page.click('.col-xs-24.col-sm-12.col-lg-8:nth-child(' + (position + 1) + ') .pointer'); // Clicks on the brand at the specified position
    await page.click(".btn-primary.wt-watch-filter-submit-btn"); // Apply the filters

    // Close the browser at the end
    await browser.close();
}