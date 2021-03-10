'use strict'

const mapDiagrams = new Map();

const backgroundColor = '#dd48dd';
const fontColor = '#cdeeff';

const extractData = obj => {
  return [obj[1], obj[2], obj[3], obj[4], obj[5]]
}

export const barChart = (id, dataObject) => {
  if (document.getElementById(id) === null) return
  const data = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [{
      data: extractData(dataObject),
      backgroundColor: backgroundColor,
      // borderColor: fontColor,
      // borderWidth: '3',
      id: 'y-axis-marks'
    }]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        barPercentage: 1,
        categoryPercentage: 0.6,
        ticks: {
          fontColor: fontColor,
          // fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          fontSize: 25,
          beginAtZero: true,
          backdropColor: '#30344A',
          maxTicksLimit: 6
        },
        gridLines: {
          display: false
        }
      }],
      xAxes: [{
        id: 'y-axis-marks',
        ticks: {
          fontColor: fontColor,
          // fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
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
  };

  if (!mapDiagrams.has(id)) {
    const linearCanvas = document.getElementById(id).getContext('2d');
    const chart = new Chart(linearCanvas, {
      type: 'bar',
      data: data,
      options: barChartOptions
    });
    mapDiagrams.set(id, chart);
  } else {
    const chart = mapDiagrams.get(id);
    chart.data.datasets[0].data = extractData(dataObject);
    chart.update();
  }
}
