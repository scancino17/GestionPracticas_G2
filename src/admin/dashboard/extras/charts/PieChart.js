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
  const [careers, setCareers] = useState();
  const [approved, setApproved] = useState();
  const [rejected, setRejected] = useState();

  function getApplicationsStatus(careers) {
    let tempApproved = new Map();
    let tempRejected = new Map();

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
              if (tempApproved.has(careers.get(doc.careerId))) {
                let counter = tempApproved.get(careers.get(doc.careerId));
                tempApproved.set(careers.get(doc.careerId), counter + 1);
              } else {
                tempApproved.set(careers.get(doc.careerId), 1);
              }

              if (!tempRejected.has(careers.get(doc.careerId)))
                tempRejected.set(careers.get(doc.careerId), 0);

              break;
            case 'Rechazado':
              if (tempRejected.has(careers.get(doc.careerId))) {
                let counter = tempRejected.get(careers.get(doc.careerId));
                tempRejected.set(careers.get(doc.careerId), counter + 1);
              } else {
                tempRejected.set(careers.get(doc.careerId), 1);
              }

              if (!tempApproved.has(careers.get(doc.careerId)))
                tempApproved.set(careers.get(doc.careerId), 0);

              break;
            default:
              break;
          }
        });

        setApproved(tempApproved);
        setRejected(tempRejected);

        props.setExportable([
          Array.from(tempApproved.keys()),
          [Object.fromEntries(tempApproved), Object.fromEntries(tempRejected)]
        ]);

        if (tempApproved.has(careers.get(props.careerId)))
          setData(
            genData(
              tempApproved.get(careers.get(props.careerId)),
              tempRejected.get(careers.get(props.careerId))
            )
          );
        else setData(noData());
      });
    return unsubscribe;
  }

  useEffect(() => {
    let temp = new Map();
    if (typeof careers === 'undefined') {
      let unsubscribe = null;
      db.collection('careers')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.id !== 'general') temp.set(doc.id, doc.data().name);
          });
          unsubscribe = getApplicationsStatus(temp);
        });
      setCareers(temp);
      return unsubscribe;
    } else {
      if (approved.has(careers.get(props.careerId)))
        setData(
          genData(
            approved.get(careers.get(props.careerId)),
            rejected.get(careers.get(props.careerId))
          )
        );
      else setData(noData());
    }
  }, [props.careerId]);

  return <Pie data={data} />;
}

export default PieChart;
