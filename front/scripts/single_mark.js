'use strict'

const percentType = 'percent'
const markType = 'mark'
const badColor = [218, 0, 0]
const goodColor = [0, 218, 0]

const gradient = (firstColor, secondColor, coef) => {
  const [r1, g1, b1] = firstColor;
  const [r2, g2, b2] = secondColor;
  const avg = [r1 + (r2 - r1) * coef, g1 + (g2 - g1) * coef, b1 + (b2 - b1) * coef];
  const max = Math.max(...avg);
  const maxFunc = (acc, val) => (acc > val ? acc : val);
  const firstColorMax = firstColor.reduce(maxFunc);
  const secondColorMax = secondColor.reduce(maxFunc);
  const normalizeCoef = firstColorMax + (secondColorMax - firstColorMax) * coef;
  const normalize = normalizeCoef / max;
  return avg.map(val => val * normalize);
}

export const singleMark = (id, value, type) => {
  if (document.getElementById(id) === null) return
  const valueElement = document.getElementById(id)
  let visibleValue
  let color
  if (type === markType) {
    visibleValue = value.toFixed(1)
    color = gradient(badColor, goodColor, ((visibleValue - 1) / 3.2) - 0.25);
  } else if (type === percentType) {
    visibleValue = Math.round(value * 1000) / 10
    color = gradient(badColor, goodColor, visibleValue / 80 - 0.25);
  }

  valueElement.innerHTML = visibleValue
  if (type === percentType) valueElement.innerHTML += '%'
  valueElement.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}
