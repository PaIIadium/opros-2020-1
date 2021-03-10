'use strict'

const fs = require('fs')
const path = require('path')
const categoriesJson = fs.readFileSync(path.resolve(__dirname, './layout_categories.json'))
const categories = JSON.parse(categoriesJson)

const lectorType = 'lector'
const practicType = 'practic'
const lectorPracticType = 'lectorPractic'
const englishType = 'english'
const minAnswers = 15

const barChart = 'barChart'
const radial = 'radial'
const singleMark = 'singleMark'

const avg = arr => arr.reduce((acc, val) => acc + val) / arr.length

const createBarChartData = arr => {
  const result = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  }

  for (const value of arr) {
    ++result[value]
  }

  return result
}

const selectType = result => {
  if (result.englishResponses >= minAnswers) return englishType
  const types = []
  if (result.lectorResponses + result.lectorPracticResponses >= minAnswers) types.push(lectorType)
  if (result.practicResponses + result.lectorPracticResponses >= minAnswers) types.push(practicType)
  if (types.length === 2) return lectorPracticType
  else if (types.length === 1) return types[0]
  return null
}

const computeResult = data => {
  const type = selectType(data)
  if (type === null) return null
  const result = {
    type,
    responses: { },
    teacherPseudonym: data.teacherPseudonym,
    picUrl: data.picUrl,
    radial: { },
    barChart: { },
    singleMark: { }
  }

  if (type !== englishType) {
    result.responses.lectorPractic = data.lectorPracticResponses
    result.responses.lector = data.lectorResponses
    result.responses.practic = data.practicResponses
  } else {
    result.responses.english = data.englishResponses
  }

  for (const [key, values] of Object.entries(data.answers)) {
    if (categories[type][key] === undefined) continue

    const valueType = categories[type][key]
    if (categories[type][key] !== barChart) result[valueType][key] = avg(values)
    else result[valueType][key] = createBarChartData(values)
  }
  return result
}

module.exports = { computeResult }
