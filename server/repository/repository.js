'use strict';

const googleApi = require('./google_api/google')
const botApi = require('./bot_api/api')
const path = require('path')
const fs = require('fs')
const finalResponseJson = fs.readFileSync(path.resolve(__dirname, './final_response.json'))
const sectionNames = ['english', 'lector', 'lectorPractic', 'practic']

const mergeResults = (...jsons) => {
  const result = JSON.parse(JSON.stringify(jsons[0]))
  for (const json of jsons.slice(1)) {
    result.lectorResponses += json.lectorResponses
    result.lectorPracticResponses += json.lectorPracticResponses
    result.practicResponses += json.practicResponses
    result.englishResponses += json.englishResponses
    for (const section in json) {
      if (sectionNames.includes(section)) {
        result[section] = JSON.parse(JSON.stringify(result[section]))
        for (const question in json[section]) {
          result[section][question] = [...result[section][question], ...json[section][question]]
        }
      }
    }
  }
  return result
}

const processResult = rawResult => {
  const result = JSON.parse(finalResponseJson)
  result.teacherPseudonym = rawResult.teacherPseudonym
  result.picUrl = rawResult.picUrl
  result.lectorResponses += rawResult.lectorResponses
  result.lectorPracticResponses += rawResult.lectorPracticResponses
  result.practicResponses += rawResult.practicResponses
  result.englishResponses += rawResult.englishResponses
  const answers = result.answers
  for (const section in rawResult) {
    if (sectionNames.includes(section)) {
      for (const question in rawResult[section]) {
        answers[question].push(...rawResult[section][question])
      }
    }
  }
  return result
}

const requestData = async (rowNumber, spreadsheetUrl) => {
  try {
    const googleJson = await googleApi.getAnswers(rowNumber, spreadsheetUrl)
    const teacherName = googleJson.teacherName
    const botJson = await botApi.getAnswers(teacherName)
    const mergedResult = mergeResults(googleJson, botJson)
    const processedResult = processResult(mergedResult)
    return processedResult
  } catch (err) {
    console.dir({ err })
  }
}

const requestAnswersCount = async (teacherName, spreadsheetUrl) => {
  const googleQuantity = await googleApi.getAnswersQuantity(teacherName, spreadsheetUrl)
  const botQuantity = await botApi.getAnswersQuantity(teacherName)
  const mergedQuantity = {
    lector: googleQuantity.lector + botQuantity.lector,
    practic: googleQuantity.practic + botQuantity.practic,
    lectorPractic: googleQuantity.lectorPractic + botQuantity.lectorPractic,
    english: googleQuantity.english + botQuantity.english
  }
  return mergedQuantity
}

module.exports = { requestData, requestAnswersCount }
