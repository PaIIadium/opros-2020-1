'use strict'

import { barChart } from './bar_chart.js';
import { radialDiagram } from './radial.js';
import { singleMark } from './single_mark.js';
import { responses } from './responses.js'
import { teacherInfo } from './teacher_info.js';

const percentType = 'percent'
const markType = 'mark'
const defaultPicUrl = 'https://pbs.twimg.com/profile_images/908388016149864448/xJNGKWP9_400x400.jpg'

barChart(('education-quality-lector'), teacherData.barChart['Якість викладання [Лек.]'], teacherData.type)
barChart(('education-quality-practic'), teacherData.barChart['Якість викладання [Прак.]'], teacherData.type)
barChart(('self-assesment'), teacherData.barChart['Як ви оцінюєте свій рівень'], teacherData.type)
singleMark('want-to-continue-lector', teacherData.singleMark['Викладач продовжував викладати [Лек.]'], percentType)
singleMark('want-to-continue-practic', teacherData.singleMark['Викладач продовжував викладати [Прак.]'], percentType)
singleMark('meaningfulness', teacherData.singleMark['Змістовність занять'], markType)
singleMark('grading-system', teacherData.singleMark['Система оцінювання'], markType)
singleMark('cheating-lector-practic', (teacherData.radial['Бали без знань [Лек.]'] + teacherData.radial['Бали без знань [Прак.]']) / 2, markType)
singleMark('cheating-lector', teacherData.singleMark['Бали без знань [Лек.]'], markType)
singleMark('cheating-practic', teacherData.singleMark['Бали без знань [Прак.]'], markType)
singleMark('skills', teacherData.singleMark['Чи володіє матеріалом'], markType)
responses('responses', teacherData.responses)
radialDiagram('radial-diagram', teacherData.radial, teacherData.type);

teacherInfo('teacher-face', 'teacher-name', teacherData, defaultPicUrl);
