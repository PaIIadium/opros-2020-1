'use strict';

const fs = require('fs');
const { asyncify } = require('../utils/asyncify')
const { google } = require('googleapis');
const { authorizeAsync } = require('./authorization')
const path = require('path')
const templateJson = fs.readFileSync(path.resolve(__dirname, '../template.json'))
const matchingJson = fs.readFileSync(path.resolve(__dirname, './matching.json'))
const matching = JSON.parse(matchingJson)

const idTableRegExp = /(?<=https:\/\/docs\.google\.com\/spreadsheets\/d\/)[^/]+/
const teachersTableRange = 'Sheet1!A1:I'
const responsesTableRange = 'Form Responses 1!A1:AY'
const teacherNameIndex = 0
const teacherPseudonymIndex = 1
const responsesTableUrlIndex = 4
const lectorCountIndex = 5
const practicCountIndex = 6
const lectorPracticCountIndex = 7
const teacherPicUrlIndex = 8
const responseTypeIndex = 1
const practicString = 'Тільки практики (лабораторні роботи)'
const lectorString = 'Тільки лекції'
const lectorPracticString = 'Лекції і практики (лабораторні роботи)'
const englishFormString = 'Англійська мова'
const defaultFormString = 'Лектор і практик'
const lectorPracticFormLength = 51
const englishFormLength = 15
const lectorRange = [2, 18]
const lectorPracticRange = [18, 41]
const practicRange = [41, 51]
const englishRange = [1, 15]
const verticalOffset = 1

const tableCache = new Map()
let oAuthClientCache

const getSpreadsheet = async (auth, url, range) => {
  const sheets = google.sheets({ version: 'v4', auth });
  const asyncGet = asyncify(sheets.spreadsheets.values.get.bind(sheets))
  const info = {
    spreadsheetId: url.match(idTableRegExp)[0],
    range: range
  }
  const res = await asyncGet(info);
  return res.data.values
}

const formatAnswer = (answer, question) => {
  if (question === 'Вільний мікрофон') {
    return answer
  } else if (question === 'Викладач продовжував викладати [Лек.]' ||
              question === 'Викладач продовжував викладати [Прак.]') {
    return answer === 'Так' ? 1 : 0
  }
  return parseInt(answer.charAt(0))
}

const writeAnswersFromResponse = (response, result, matching, keys, range) => {
  keys = keys.slice(...range)
  response.slice(...range).forEach((answer, index) => {
    if (answer !== '') {
      const question = matching[keys[index]]
      try {
        result[question].push(
          formatAnswer(answer, question))
      } catch (err) {
        console.log('Maybe some response has been updated')
        throw new Error(err)
      }
    }
  })
}

const writeResponsesFromTable = responsesTable => {
  const result = JSON.parse(templateJson)
  const keys = responsesTable[0]
  const formType = keys.length === englishFormLength ? englishFormString
    : defaultFormString
  if (formType === englishFormString) {
    result.englishResponses = responsesTable.length - verticalOffset
    for (const response of responsesTable.slice(verticalOffset)) {
      writeAnswersFromResponse(response,
        result.english, matching.english, keys, englishRange)
    }
  } else if (formType === defaultFormString) {
    for (const response of responsesTable.slice(verticalOffset)) {
      const responseType = response[1]
      if (responseType === lectorString) {
        ++result.lectorResponses
        writeAnswersFromResponse(response,
          result.lector, matching.lector, keys, lectorRange)
      } else if (responseType === lectorPracticString) {
        ++result.lectorPracticResponses
        writeAnswersFromResponse(response,
          result.lectorPractic, matching.lectorPractic, keys, lectorPracticRange)
      } else if (responseType === practicString) {
        ++result.practicResponses
        writeAnswersFromResponse(response,
          result.practic, matching.practic, keys, practicRange)
      }
    }
  }
  return result
}

const addTeacherInfo = (result, row) => {
  result.teacherName = row[teacherNameIndex]
  result.teacherPseudonym = row[teacherPseudonymIndex]
  result.picUrl = row[teacherPicUrlIndex]
}

const getOauthClient = async () => {
  if (oAuthClientCache) return oAuthClientCache
  const credentials = fs.readFileSync(path.resolve(__dirname, './credentials.json'), 'utf-8')
  oAuthClientCache = await authorizeAsync(JSON.parse(credentials))
  return oAuthClientCache
}

const getAnswers = async (rowNumber, url) => {
  rowNumber -= 1
  try {
    let teachersTable = tableCache.get(url)
    if (!teachersTable) {
      teachersTable = await getSpreadsheet(await getOauthClient(), url, teachersTableRange)
      tableCache.set(url, teachersTable)
    }
    const row = teachersTable[rowNumber]
    const responsesTableUrl = row[responsesTableUrlIndex]
    const responsesTable = await getSpreadsheet(await getOauthClient(), responsesTableUrl, responsesTableRange)
    const result = writeResponsesFromTable(responsesTable)
    addTeacherInfo(result, row)
    return result
  } catch (err) {
    console.dir(err)
    return err
  }
};

const getAnswersQuantity = async (teacherName, url) => {
  let teachersTable = tableCache.get(url)
  if (!teachersTable) {
    teachersTable = await getSpreadsheet(await getOauthClient(), url, teachersTableRange)
    tableCache.set(url, teachersTable)
  }
  const row = teachersTable.filter(row => row[teacherNameIndex] === teacherName)[0]
  const english = teacherName.match('ENG') ? parseInt(row[lectorCountIndex]) : 0
  const lector = english ? 0 : parseInt(row[lectorCountIndex])
  const practic = parseInt(row[practicCountIndex])
  const lectorPractic = parseInt(row[lectorPracticCountIndex])
  return { lector, practic, lectorPractic, english }
}

const getTable = async url => {
  const table = await getSpreadsheet(await getOauthClient(), url, teachersTableRange)
  return table
}

module.exports = { getAnswers, getAnswersQuantity, getTable };
