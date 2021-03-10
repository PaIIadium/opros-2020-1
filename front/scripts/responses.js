'use strict'

export const responses = (id, data) => {
  let string
  if (data.english !== undefined) string = data.english
  else string = `${data.lector} / ${data.practic} / ${data.lectorPractic}`
  const responsesElement = document.getElementById(id)
  responsesElement.innerHTML = string
}
