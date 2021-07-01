import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { db } from '../../../../firebase';
import useAuth from '../../../../providers/Auth';
function VerticalBar(props) {
  const [data, setData] = useState();
  const { user } = useAuth();
  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('applications').where('careerId', '==', user.careerId)
      : db.collection('applications');
    const unsubscribe = dbRef
      .where('status', '==', 'Aprobado')
      .onSnapshot((querySnapshot) => {
        let companyCounter = new Map();

        const temp = [];

        querySnapshot.forEach((doc) =>
          temp.push({ id: doc.id, ...doc.data() })
        );

        temp.forEach((doc) => {
          if (companyCounter.has(doc.Empresa)) {
            let counter = companyCounter.get(doc.Empresa);
            companyCounter.set(doc.Empresa, counter + 1);
          } else {
            companyCounter.set(doc.Empresa, 1);
          }
        });

        props.setExportable([
          Array.from(companyCounter.keys()),
          [Object.fromEntries(companyCounter)]
        ]);

        let list = Array.from(companyCounter.entries());
        list = list
          .sort(function (a, b) {
            return b[1] - a[1];
          })
          .slice(0, 6);

        let config = {
          labels: list.map(function (i) {
            return i[0];
          }),
          datasets: [
            {
              label: 'Total Practicantes',
              data: list.map(function (i) {
                return i[1];
              }),
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
