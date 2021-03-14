'use strict'

const NAME_INDEX = 1
const TIMEOUT = 1000;

const fs = require('fs');
const path = require('path');
const configJson = fs.readFileSync(path.resolve(__dirname, './config.json'));
const config = JSON.parse(configJson);
const teachersTableUrl = config.teachersTableURL;
const startRowNumber = config.startRowNumber;

const puppeteer = require('puppeteer');
const { getTable } = require('./server/repository/google_api/google.js')
const buttonText = 'Скрыть'

const getPicture = async (url, page, pictureName) => {
  await page.goto(url);
  const innerHtml = await page.evaluate(() => document.body.innerHTML)
  if (innerHtml === '') return
  const [button] = await page.$x(`//button[contains(., ${buttonText})]`);
  await button.click();
  await page.screenshot({ path: `screenshots/${pictureName}.png` });
}

const makePageUrl = (generalTableUrl, rowNumber) => {
  return `http://localhost:3000/submit?row-number=${rowNumber}&teachers-table-url=${generalTableUrl}`
}

const makeScreenshots = async teachersTableUrl => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1500 })
  const table = await getTable(teachersTableUrl)
  for (let i = startRowNumber; i < table.length; i++) {
    const pageUrl = makePageUrl(teachersTableUrl, i)
    await getPicture(pageUrl, page, table[i - 1][NAME_INDEX])
    console.log(table[i - 1][NAME_INDEX])
    await new Promise(resolve => setTimeout(resolve, TIMEOUT))
  }
  await browser.close();
}

(async () => {
  await makeScreenshots(teachersTableUrl)
})()
