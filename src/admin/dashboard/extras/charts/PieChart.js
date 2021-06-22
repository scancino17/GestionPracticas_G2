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

function PieChart(props) {
  const [data, setData] = useState(genData());
  let approved = new Map();
  let rejected = new Map();

  useEffect(() => {
    if (approved.size === 0 && rejected.size === 0) {
      const unsubscribe = db
        .collection('applications')
        .onSnapshot((querySnapshot) => {
          const temp = [];

          querySnapshot.forEach((doc) =>
            temp.push({ id: doc.id, ...doc.data() })
          );

          temp.forEach((doc) => {
            switch (doc.status) {
              case 'Aprobado':
                if (approved.has(doc.careerId)) {
                  let counter = approved.get(doc.careerId);
                  approved.set(doc.careerId, counter + 1);
                } else {
                  approved.set(doc.careerId, 1);
                }

                if (!rejected.has(doc.careerId)) rejected.set(doc.careerId, 0);

                break;
              case 'Rechazado':
                if (rejected.has(doc.careerId)) {
                  let counter = rejected.get(doc.careerId);
                  rejected.set(doc.careerId, counter + 1);
                } else {
                  rejected.set(doc.careerId, 1);
                }

                if (!approved.has(doc.careerId)) approved.set(doc.careerId, 0);

                break;
              default:
                break;
            }
          });

          props.setExportable([
            Array.from(approved.keys()),
            [Object.fromEntries(approved), Object.fromEntries(rejected)]
          ]);
          if (approved.has(props.careerId))
            setData(
              genData(
                approved.get(props.careerId),
                rejected.get(props.careerId)
              )
            );
          else setData(noData());
        });
      return unsubscribe;
    } else {
      props.setExportable([
        Array.from(approved.keys()),
        [Object.fromEntries(approved), Object.fromEntries(rejected)]
      ]);

      if (approved.has(props.careerId))
        setData(
          genData(approved.get(props.careerId), rejected.get(props.careerId))
        );
      else setData(noData());
    }
  }, [props.careerId]);

  return <Pie data={data} />;
}

export default PieChart;
