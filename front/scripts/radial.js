'use strict'

import { captions } from './radial_captions.js'

let instance = null;

const styles = {
  lector: {
    backgroundColor: '#48abddb4',
    fontColor: '#e6f7ff',
    backdropColor: '#08141a',
    borderColor: function () {
      return this.fontColor
    },
    lineColor: function () {
      return this.fontColor
    }
  },
  practic: {
    backgroundColor: '#dfdf39b4',
    fontColor: '#ffffea',
    backdropColor: '#141402',
    borderColor: function () {
      return this.fontColor
    },
    lineColor: function () {
      return this.fontColor
    }
  },
  lectorPractic: {
    backgroundColor: '#dd48ddb4',
    fontColor: '#fee6ff',
    backdropColor: '#19081a',
    borderColor: function () {
      return this.fontColor
    },
    lineColor: function () {
      return this.fontColor
    }
  },
  english: {
    backgroundColor: '#56cc91b4',
    fontColor: '#e7fff3',
    backdropColor: '#081a0e',
    borderColor: function () {
      return this.fontColor
    },
    lineColor: function () {
      return this.fontColor
    }
  }
}

const getChartOptions = type => (
  {
    responsive: true,
    maintainAspectRatio: false,
    scale: {
      angleLines: {
        display: true,
        color: styles[type].lineColor(),
        lineWidth: 2
      },
      gridLines: {
        display: true,
        color: styles[type].lineColor(),
        lineWidth: 2
      },
      ticks: {
        display: true,
        beginAtZero: true,
        min: 1,
        max: 5,
        stepSize: 1,
        fontSize: 24,
        fontColor: styles[type].fontColor,
        backdropColor: styles[type].backdropColor
      },
      pointLabels: {
        fontSize: 23,
        fontColor: styles[type].fontColor
      }
    },
    legend: {
      display: false
    }
  }
)

const makeDataset = (values, type) => {
  return [{
    label: null,
    backgroundColor: styles[type].backgroundColor,
    borderColor: styles[type].borderColor(),
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
  return { labels: matchCaptions(labels, type), datasets: makeDataset(values, type) }
}

export const radialDiagram = (id, dataObject, type) => {
  if (instance === null) {
    const radialCanvas = document.getElementById(id).getContext('2d');
    const data = extractData(dataObject, type)
    instance = new Chart(radialCanvas, {
      type: 'radar',
      data,
      options: getChartOptions(type)
    });
  }
}
