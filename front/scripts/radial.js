'use strict'

import { captions } from './radial_captions.js'

let instance = null;
const fontColor = '#fee6ff';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scale: {
    angleLines: {
      display: true,
      color: fontColor,
      lineWidth: 2
    },
    gridLines: {
      display: true,
      color: fontColor,
      lineWidth: 2
    },
    ticks: {
      display: true,
      beginAtZero: true,
      min: 1,
      max: 5,
      stepSize: 1,
      fontSize: 24,
      fontColor: fontColor,
      backdropColor: '#19081a'
    },
    pointLabels: {
      fontSize: 24,
      fontColor: fontColor
    }
  },
  legend: {
    display: false
  }
};

const makeDataset = values => {
  return [{
    label: null,
    backgroundColor: '#dd48ddb4',
    borderColor: fontColor,
    data: values,
    pointRadius: '0',
    borderWidth: '3'
  }]
}

const matchCaptions = (labels, type) => {
  const result = []
  labels.forEach(label => result.push(captions[type][label]))
  return result
}

const extractData = (obj, type) => {
  const labels = Object.keys(obj)
  const values = Object.values(obj)
  return { labels: matchCaptions(labels, type), datasets: makeDataset(values) }
}

export const radialDiagram = (id, dataObject, type) => {
  if (instance === null) {
    const radialCanvas = document.getElementById(id).getContext('2d');
    const data = extractData(dataObject, type)
    instance = new Chart(radialCanvas, {
      type: 'radar',
      data,
      options: chartOptions
    });
  }
}
