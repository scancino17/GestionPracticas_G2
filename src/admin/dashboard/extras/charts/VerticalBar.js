import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { db } from '../../../../firebase';

function VerticalBar() {
  const [data, setData] = useState();

  useEffect(() => {
    const unsubscribe = db
      .collection('applications')
      .onSnapshot((querySnapshot) => {
        let companyCounter = new Map();

        querySnapshot.forEach((doc) => {
          if (companyCounter.has(doc.data().Empresa)) {
            let counter = companyCounter.get(doc.data().Empresa);
            companyCounter.set(doc.data().Empresa, counter + 1);
          } else {
            companyCounter.set(doc.data().Empresa, 1);
          }
        });

        companyCounter[Symbol.iterator] = function* () {
          yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        };

        let config = {
          labels: Array.from(companyCounter.keys()).slice(0, 6),
          datasets: [
            {
              label: 'Total Practicantes',
              data: Array.from(companyCounter.values()).slice(0, 6),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        };

        setData(config);
      });
    return unsubscribe;
  }, []);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  return <Bar data={data} options={options} />;
}

export default VerticalBar;
