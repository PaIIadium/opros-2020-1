'use strict'

import { barChart } from './bar_chart.js';
import { radialDiagram } from './radial.js';
import { singleMark } from './single_mark.js';
import { responses } from './responses.js'
import { teacherInfo } from './teacher_info.js';

const percentType = 'percent'
const markType = 'mark'

console.log(teacherData)
barChart(('education-quality-lector'), teacherData.barChart['Якість викладання [Лек.]'])
barChart(('education-quality-practic'), teacherData.barChart['Якість викладання [Прак.]'])
barChart(('self-assesment'), teacherData.barChart['Як ви оцінюєте свій рівень'])
singleMark('want-to-continue-lector', teacherData.singleMark['Викладач продовжував викладати [Лек.]'], percentType)
singleMark('want-to-continue-practic', teacherData.singleMark['Викладач продовжував викладати [Прак.]'], percentType)
singleMark('meaningfulness', teacherData.singleMark['Чи володіє матеріалом'], markType)
singleMark('grading-system', teacherData.singleMark['Система оцінювання'], markType)
singleMark('relevance', teacherData.singleMark['Актуальність матеріалу'], markType)
singleMark('skills', teacherData.singleMark['Чи володіє матеріалом'], markType)
responses('responses', teacherData.responses)
radialDiagram('radial-diagram', teacherData.radial, teacherData.type);

teacherInfo('teacher-face', 'teacher-name', teacherData);
