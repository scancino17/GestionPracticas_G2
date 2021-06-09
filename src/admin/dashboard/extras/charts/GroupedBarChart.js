import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { db } from '../../../../firebase';

function GroupedBar() {
  const [data, setData] = useState();

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

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .orderBy('careerId')
      .onSnapshot((querySnapshot) => {
        let noAction = new Map();
        let applying = new Map();
        let onIntern = new Map();

        querySnapshot.forEach((doc) => {
          if (doc.data().step) {
            switch (doc.data().step) {
              case 0:
                if (noAction.has(doc.data().careerId)) {
                  let counter = noAction.get(doc.data().careerId);
                  noAction.set(doc.data().careerId, counter + 1);
                } else {
                  noAction.set(doc.data().careerId, 1);
                }
                break;
              case 1:
                if (applying.has(doc.data().careerId)) {
                  let counter = applying.get(doc.data().careerId);
                  applying.set(doc.data().careerId, counter + 1);
                } else {
                  applying.set(doc.data().careerId, 1);
                }
                break;
              default:
                if (onIntern.has(doc.data().careerId)) {
                  let counter = onIntern.get(doc.data().careerId);
                  onIntern.set(doc.data().careerId, counter + 1);
                } else {
                  onIntern.set(doc.data().careerId, 1);
                }
                break;
            }
          } else {
            if (noAction.has(doc.data().careerId)) {
              let counter = noAction.get(doc.data().careerId);
              noAction.set(doc.data().careerId, counter + 1);
            } else {
              noAction.set(doc.data().careerId, 1);
            }
          }
        });

        let config = {
          labels: Array.from(noAction.keys()),
          datasets: [
            {
              label: 'Sin Práctica',
              data: Array.from(noAction.values()),
              backgroundColor: 'rgb(255, 99, 132)'
            },
            {
              label: 'Declarando Intención',
              data: Array.from(applying.values()),
              backgroundColor: 'rgb(54, 162, 235)'
            },
            {
              label: 'En Práctica',
              data: Array.from(applying.values()),
              backgroundColor: 'rgb(75, 192, 192)'
            }
          ]
        };

        setData(config);
      });
    return unsubscribe;
  }, []);

  return <Bar data={data} options={options} />;
}

export default GroupedBar;
