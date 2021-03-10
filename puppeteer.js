'use strict'

const FACULTY_URL = 'https://docs.google.com/spreadsheets/d/1Q32bssL7mC7BcTqvIOLUMxnMEUptPtxaXu6AwBRK9qM/edit#gid=0'
const NAME_INDEX = 1

const puppeteer = require('puppeteer');
const { getTable } = require('./server/repository/google_api/google.js')

const getPicture = async (url, page, pictureName) => {
  await page.goto(url);
  const [button] = await page.$x("//button[contains(., 'Скрыть')]");
  await button.click();
  await page.screenshot({ path: `screenshots/${pictureName}.png` });
}

const makePageUrl = (generalTableUrl, rowNumber) => {
  return `http://localhost:3000/submit?row-number=${rowNumber}&teachers-table-url=${generalTableUrl}`
}

const makeScreenshots = async facultyUrl => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1500 })
  const table = await getTable(facultyUrl)
  for (let i = 2; i < table.length; i++) {
    const pageUrl = makePageUrl(facultyUrl, i)
    await getPicture(pageUrl, page, table[i - 1][NAME_INDEX])
    console.log(table[i - 1][NAME_INDEX])
  }
  await browser.close();
}

(async () => {
  await makeScreenshots(FACULTY_URL)
})()
