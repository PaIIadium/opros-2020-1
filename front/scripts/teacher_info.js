'use strict'

export const teacherInfo = (picId, nameId, teacherData, defaultPicUrl) => {
  if (teacherData.picUrl === undefined) {
    document.getElementById(picId).src = defaultPicUrl
  } else {
    document.getElementById(picId).src = teacherData.picUrl;
  }
  document.getElementById(nameId).innerHTML = teacherData.teacherPseudonym;
}
