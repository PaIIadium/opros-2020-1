'use strict'

const fs = require('fs');
const path = require('path')
const templateJson = fs.readFileSync(path.resolve(__dirname, '../template.json'))
const matchingJson = fs.readFileSync(path.resolve(__dirname, './matching.json'))
const matching = JSON.parse(matchingJson)
const snap = fs.readFileSync(path.resolve(__dirname, './snap.json'), 'utf-8')
const snapObj = JSON.parse(snap)

const lectorSection = 'LECTOR'
const practicSection = 'PRACTIC'
const lectorPracticSection = 'LECTOR_PRACTIC'
const englishSection = 'ENG'
const openCommentQuestion = 'Вільний мікрофон'

const formatAnswer = (answer, question) => {
  const specialQuestions = [
    'Викладач продовжував викладати [Лек.]',
    'Викладач продовжував викладати [Прак.]',
    'Вільний мікрофон'
  ]
  if (!specialQuestions.includes(question)) return ++answer
  return answer
}

const writeAnswersFromResponse = (response, result, matching) => {
  if (response.open_question_answer !== null) {
    result[matching[openCommentQuestion]].push(response.open_question_answer)
  }
  response.answers.forEach(answer => {
    const matchedQuestions = matching[answer.question__question_text]
    if (Array.isArray(matchedQuestions)) {
      const [question1, question2] = matchedQuestions
      result[question1].push(
        formatAnswer(answer.answer_1, question1))
      result[question2].push(
        formatAnswer(answer.answer_2, question2))
    } else {
      result[matchedQuestions].push(
        formatAnswer(answer.answer_1, matchedQuestions))
    }
  })
}

const createResult = sections => {
  const result = JSON.parse(templateJson)
  for (const section of sections) {
    const sectionType = section.teacher_type
    if (sectionType === lectorSection) {
      ++result.lectorResponses
      writeAnswersFromResponse(section, result.lector, matching.lector)
    } else if (sectionType === lectorPracticSection) {
      ++result.lectorPracticResponses
      writeAnswersFromResponse(section, result.lectorPractic, matching.lectorPractic)
    } else if (sectionType === practicSection) {
      ++result.practicResponses
      writeAnswersFromResponse(section, result.practic, matching.practic)
    } else if (sectionType === englishSection) {
      ++result.englishResponses
      writeAnswersFromResponse(section, result.english, matching.english)
    }
  }
  return result
}

const addTeacherInfo = (result, teacherName) => {
  result.teacherName = teacherName
}

const getAnswers = async teacherName => {
  const sections = snapObj.filter(section => section.teacher_name === teacherName)
  // console.dir(JSON.stringify(snapObj))
  const result = createResult(sections)
  addTeacherInfo(result, teacherName)
  return result
}

const getAnswersQuantity = async teacherName => {
  const lector = snapObj.filter(section =>
    section.teacher_name === teacherName && section.teacher_type === lectorSection)
    .length
  const practic = snapObj.filter(section =>
    section.teacher_name === teacherName && section.teacher_type === practicSection)
    .length
  const lectorPractic = snapObj.filter(section =>
    section.teacher_name === teacherName && section.teacher_type === lectorPracticSection)
    .length
  const english = snapObj.filter(section =>
    section.teacher_name === teacherName && section.teacher_type === englishSection)
    .length
  return { lector, practic, lectorPractic, english }
}

module.exports = { getAnswers, getAnswersQuantity };
