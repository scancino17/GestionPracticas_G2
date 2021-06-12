import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { db } from '../../../../firebase';

const genData = (approved, rejected) => ({
  labels: ['Aprobados', 'Rechazados'],
  datasets: [
    {
      label: 'Estado',
      data: [approved, rejected],
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
      borderWidth: 1
    }
  ]
});

const noData = () => ({
  labels: ['Sin Registros'],
  datasets: [
    {
      label: 'Estado',
      data: [1],
      backgroundColor: ['rgba(197, 197, 197, 0.2)'],
      borderColor: ['rgba(197, 197, 197, 1)'],
      borderWidth: 1
    }
  ]
});

function PieChart(careerId) {
  const [data, setData] = useState(genData());

  useEffect(() => {
    var approved = 0;
    var rejected = 0;

    const unsubscribe = db
      .collection('applications')
      .where('careerId', '==', careerId.careerId)
      .onSnapshot((querySnapshot) => {
        const temp = [];

        querySnapshot.forEach((doc) =>
          temp.push({ id: doc.id, ...doc.data() })
        );

        temp.forEach((doc) => {
          switch (doc.status) {
            case 'Aprobado':
              approved++;
              break;
            case 'Rechazado':
              rejected++;
              break;
            default:
              break;
          }
        });

        if (approved !== 0 || rejected !== 0)
          setData(genData(approved, rejected));
        else setData(noData());
      });
    return unsubscribe;
  }, [careerId]);

  return <Pie data={data} />;
}

export default PieChart;
