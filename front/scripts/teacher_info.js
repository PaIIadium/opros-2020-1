'use strict'

export const teacherInfo = (picId, nameId, teacherData) => {
  document.getElementById(picId).src = teacherData.picUrl;
  document.getElementById(nameId).innerHTML = teacherData.teacherPseudonym;
}
