import React from 'react';
import { Bar } from 'react-chartjs-2';



function VerticalBarChart(props){
  const data = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    datasets: [
      {
        data: props.xAxisData,
        backgroundColor: [
          'rgba(255, 255, 255, 0.4)',
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          fontWeight: 'bold',
          fontFamily: "Roboto",
          precision: 0,
        }
      },
      y: {
        ticks: {
          color: 'white',
          fontWeight: 'bold',
          precision: 0,
          fontFamily: "Roboto"
        }
      }
    },
  };

  return(
  <React.Fragment>
    <Bar data={data} options={options} />
  </React.Fragment>
  )
}

export default VerticalBarChart;
