import { chromium } from 'playwright-extra';
import * as cheerio from 'cheerio';

const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);

const helloWorld = async () => {
  const browser = await chromium.launch({
    headless: false, // For demo, try to always use headless mode
  });
  const page = await browser.newPage();

  const response = await page.goto('https://whatismyipaddress.com');

  if (response.ok()) {
    const responseText = await response.text();
    const $ = cheerio.load(responseText);

    const address = $('#ipv4');
    if (address.length > 0) {
      const ip = address.first().text();
      console.log(`Your ip: ${ip}`);
    }
  }

  await browser.close();
};

(async () => {
  await helloWorld();
})();
