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
    let careers = new Map();
    let noAction = new Map();
    let applying = new Map();
    let onIntern = new Map();

    const unsubscribe = db.collection('careers').onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.id !== 'general') careers.set(doc.id, doc.data().name);
      });
      getStudentsStatus();
    });

    function getStudentsStatus() {
      const unsubscribe = db
        .collection('users')
        .orderBy('careerId')
        .onSnapshot((querySnapshot) => {
          const temp = [];

          querySnapshot.forEach((doc) =>
            temp.push({ id: doc.id, ...doc.data() })
          );

          temp.forEach((doc) => {
            if (doc.step) {
              switch (doc.step) {
                case 0:
                  if (noAction.has(careers.get(doc.careerId))) {
                    let counter = noAction.get(careers.get(doc.careerId));
                    noAction.set(careers.get(doc.careerId), counter + 1);
                  } else {
                    noAction.set(careers.get(doc.careerId), 1);
                  }
                  break;
                case 1:
                  if (applying.has(careers.get(doc.careerId))) {
                    let counter = applying.get(careers.get(doc.careerId));
                    applying.set(careers.get(doc.careerId), counter + 1);
                  } else {
                    applying.set(careers.get(doc.careerId), 1);
                  }
                  break;
                default:
                  if (onIntern.has(careers.get(doc.careerId))) {
                    let counter = onIntern.get(careers.get(doc.careerId));
                    onIntern.set(careers.get(doc.careerId), counter + 1);
                  } else {
                    onIntern.set(careers.get(doc.careerId), 1);
                  }
                  break;
              }
            } else {
              if (noAction.has(careers.get(doc.careerId))) {
                let counter = noAction.get(careers.get(doc.careerId));
                noAction.set(careers.get(doc.careerId), counter + 1);
              } else {
                noAction.set(careers.get(doc.careerId), 1);
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
                label: 'En Proceso de Inscripción',
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
    }

    return unsubscribe;
  }, []);

  return <Bar data={data} options={options} />;
}

export default GroupedBar;
