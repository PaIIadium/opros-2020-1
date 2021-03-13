'use strict';

const fs = require('fs');
const path = require('path')
const { requestData } = require('./repository/repository');
const { computeResult } = require('./compute')

const lectorPracticHtml = fs.readFileSync(path.resolve(__dirname, '../front/pages/html/lector_practic.html'));
const lectorHtml = fs.readFileSync(path.resolve(__dirname, '../front/pages/html/lector.html'));
const practicHtml = fs.readFileSync(path.resolve(__dirname, '../front/pages/html/practic.html'));
const englishHtml = fs.readFileSync(path.resolve(__dirname, '../front/pages/html/english.html'));

const barChartJs = fs.readFileSync(path.resolve(__dirname, '../front/scripts/bar_chart.js'));
const radialJs = fs.readFileSync(path.resolve(__dirname, '../front/scripts/radial.js'));
const teacherInfoJs = fs.readFileSync(path.resolve(__dirname, '../front/scripts/teacher_info.js'));
const singleMarkJs = fs.readFileSync(path.resolve(__dirname, '../front/scripts/single_mark.js'));
const lectorPracticCss = fs.readFileSync(path.resolve(__dirname, '../front/pages/css/lector_practic.css'));
const lectorCss = fs.readFileSync(path.resolve(__dirname, '../front/pages/css/lector.css'));
const practicCss = fs.readFileSync(path.resolve(__dirname, '../front/pages/css/practic.css'));
const englishCss = fs.readFileSync(path.resolve(__dirname, '../front/pages/css/english.css'));
const resetCss = fs.readFileSync(path.resolve(__dirname, '../front/pages/css/reset.css'));
const chartJs = fs.readFileSync(path.resolve(__dirname, '../node_modules/chart.js/dist/Chart.min.js'));
const initializeJs = fs.readFileSync(path.resolve(__dirname, '../front/scripts/initialize.js'));
const radialCaptionsJs = fs.readFileSync(path.resolve(__dirname, '../front/scripts/radial_captions.js'));
const responsesJs = fs.readFileSync(path.resolve(__dirname, '../front/scripts/responses.js'));

const http = require('http');
const port = 3000;

const lectorType = 'lector'
const practicType = 'practic'
const lectorPracticType = 'lectorPractic'
const englishType = 'english'

const addTeacherDataToHtml = (html, teacherData) => {
  return html.substring(0, 35) +
    `<script>const teacherData = ${JSON.stringify(teacherData)}</script>` +
    html.substring(35);
}

const onSubmitHandler = async (request, response) => {
  const urlKeys = new URLSearchParams(request.url.slice(8))
  const rowNumber = urlKeys.get('row-number');
  const teachersTableUrl = urlKeys.get('teachers-table-url')
  const data = await requestData(parseInt(rowNumber), teachersTableUrl)
  const computedResult = computeResult(data)
  let html;
  if (computedResult.type === lectorType) html = lectorHtml
  else if (computedResult.type === practicType) html = practicHtml
  else if (computedResult.type === lectorPracticType) html = lectorPracticHtml
  else if (computedResult.type === englishType) html = englishHtml
  else html = ''
  const htmlWithTeacherData = addTeacherDataToHtml(html.toString(), computedResult)
  response.write(htmlWithTeacherData)
}

const requestHandler = async (request, response) => {
  try {
    if (request.url.slice(0, 7) === '/submit') {
      await onSubmitHandler(request, response)
    } else {
      switch (request.url) {
        case '/favicon.ico':
          response.write(lectorPracticHtml);
          break;
        case '/reset.css':
          response.write(resetCss);
          break;
        case '/lector_practic.css':
          response.write(lectorPracticCss);
          break;
        case '/lector.css':
          response.write(lectorCss);
          break;
        case '/practic.css':
          response.write(practicCss);
          break;
        case '/english.css':
          response.write(englishCss);
          break;
        case '/node_modules/chart.js/dist/Chart.min.js':
          response.setHeader('Content-type', 'text/javascript')
          response.write(chartJs);
          break;
        case '/scripts/radial.js':
          response.setHeader('Content-type', 'text/javascript')
          response.write(radialJs);
          break;
        case '/scripts/bar_chart.js':
          response.setHeader('Content-type', 'text/javascript')
          response.write(barChartJs);
          break;
        case '/scripts/single_mark.js':
          response.setHeader('Content-type', 'text/javascript')
          response.write(singleMarkJs);
          break;
        case '/scripts/teacher_info.js':
          response.setHeader('Content-type', 'text/javascript')
          response.write(teacherInfoJs);
          break;
        case '/scripts/initialize.js':
          response.setHeader('Content-type', 'text/javascript')
          response.write(initializeJs);
          break;
        case '/scripts/radial_captions.js':
          response.setHeader('Content-type', 'text/javascript')
          response.write(radialCaptionsJs);
          break;
        case '/scripts/responses.js':
          response.setHeader('Content-type', 'text/javascript')
          response.write(responsesJs);
          break;
        default:
          response.writeHeader(200, { 'Content-Type': 'text/html' });
          response.write(lectorPracticHtml);
      }
    }
    response.end();
  } catch (err) {
    console.dir({ err })
  }
};

const server = http.createServer(requestHandler);
server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
