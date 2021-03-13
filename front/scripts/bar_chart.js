'use strict'

const mapDiagrams = new Map();

const styles = {
  lector: {
    backgroundColor: '#48abdd',
    fontColor: '#e6f7ff'
  },
  practic: {
    backgroundColor: '#dfdf39',
    fontColor: '#ffffea'
  },
  lectorPractic: {
    backgroundColor: '#dd48dd',
    fontColor: '#fee6ff'
  },
  english: {
    backgroundColor: '#56cc91',
    fontColor: '#e7fff3'
  }
}

const getBarChartOptions = type => (
  {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        barPercentage: 1,
        categoryPercentage: 0.6,
        ticks: {
          fontColor: styles[type].fontColor,
          fontSize: 25,
          beginAtZero: true,
          maxTicksLimit: 6
        },
        gridLines: {
          display: false
        }
      }],
      xAxes: [{
        id: 'y-axis-marks',
        ticks: {
          fontColor: styles[type].fontColor,
          fontSize: 25,
          beginAtZero: true
        },
        gridLines: {
          display: false
        }
      }]
    },
    legend: {
      display: false
    }
  })

const extractData = obj => {
  return [obj[1], obj[2], obj[3], obj[4], obj[5]]
}

export const barChart = (id, dataObject, type) => {
  if (document.getElementById(id) === null) return
  const data = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [{
      data: extractData(dataObject),
      backgroundColor: styles[type].backgroundColor,
      id: 'y-axis-marks'
    }]
  };

  if (!mapDiagrams.has(id)) {
    const linearCanvas = document.getElementById(id).getContext('2d');
    const chart = new Chart(linearCanvas, {
      type: 'bar',
      data: data,
      options: getBarChartOptions(type)
    });
    mapDiagrams.set(id, chart);
  } else {
    const chart = mapDiagrams.get(id);
    chart.data.datasets[0].data = extractData(dataObject);
    chart.update();
  }
}
