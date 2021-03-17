'use strict'

const NAME_INDEX = 1
const TIMEOUT = 0;

const { config } = require('./utils/config_loader')

const teachersTableUrl = config.teachersTableURL;
const startRowNumber = config.startRowNumber;
const endRowNumber = config.endRowNumber;

const puppeteer = require('puppeteer');
const { getTable } = require('./server/repository/google_api/google.js')
const buttonText = 'Скрыть'

const getPicture = async (url, page, pictureName) => {
  await page.goto(url);
  await new Promise(resolve => setTimeout(resolve, 1100))
  const innerHtml = await page.evaluate(() => document.body.innerHTML)
  if (innerHtml === '') return
  const [button] = await page.$x(`//button[contains(., ${buttonText})]`);
  await button.click();
  await page.screenshot({ path: `screenshots/${pictureName}.png` });
}

const makePageUrl = (teachersTableUrl, rowNumber) => {
  return `http://localhost:3000/submit?row-number=${rowNumber}&teachers-table-url=${teachersTableUrl}`
}

const makeScreenshots = async teachersTableUrl => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1500 })
  const table = await getTable(teachersTableUrl)
  for (let i = startRowNumber; i <= endRowNumber; i++) {
    const pageUrl = makePageUrl(teachersTableUrl, i)
    await getPicture(pageUrl, page, table[i - 1][NAME_INDEX])
    console.log(`${i}: ${table[i - 1][NAME_INDEX]}`)
    await new Promise(resolve => setTimeout(resolve, TIMEOUT))
  }
  await browser.close();
}

(async () => {
  await makeScreenshots(teachersTableUrl)
})()
