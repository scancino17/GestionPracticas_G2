import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Pie } from 'react-chartjs-2';
import { db } from '../../../../firebase';
import { useSupervisor } from '../../../../providers/Supervisor';
import { DEFAULT_CAREER } from '../../../../providers/User';

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
  const [loaded, setLoaded] = useState(false);
  const { applications, careers } = useSupervisor();

  useEffect(() => {
    let careersMap = new Map();
    careers.forEach((doc) => {
      if (doc.id !== DEFAULT_CAREER) careersMap.set(doc.id, doc.name);
    });

    let tempApproved = new Map();
    let tempRejected = new Map();

    tempApproved.set('Todas las carreras', 0);
    tempRejected.set('Todas las carreras', 0);

    applications.forEach((doc) => {
      switch (doc.status) {
        case 'Aprobado':
          if (tempApproved.has(careersMap.get(doc.careerId))) {
            let counter = tempApproved.get(careersMap.get(doc.careerId));
            tempApproved.set(careersMap.get(doc.careerId), counter + 1);
          } else {
            tempApproved.set(careersMap.get(doc.careerId), 1);
          }

          if (!tempRejected.has(careersMap.get(doc.careerId)))
            tempRejected.set(careersMap.get(doc.careerId), 0);

          tempApproved.set(
            'Todas las carreras',
            tempApproved.get('Todas las carreras') + 1
          );

          break;
        case 'Rechazado':
          if (tempRejected.has(careersMap.get(doc.careerId))) {
            let counter = tempRejected.get(careersMap.get(doc.careerId));
            tempRejected.set(careersMap.get(doc.careerId), counter + 1);
          } else {
            tempRejected.set(careersMap.get(doc.careerId), 1);
          }

          if (!tempApproved.has(careersMap.get(doc.careerId)))
            tempApproved.set(careersMap.get(doc.careerId), 0);

          tempRejected.set(
            'Todas las carreras',
            tempRejected.get('Todas las carreras') + 1
          );

          break;
        default:
          break;
      }
    });

    props.setExportable([
      Array.from(tempApproved.keys()),
      [Object.fromEntries(tempApproved), Object.fromEntries(tempRejected)]
    ]);

    if (tempApproved.has(careersMap.get(props.careerId)))
      setData(
        genData(
          tempApproved.get(careersMap.get(props.careerId)),
          tempRejected.get(careersMap.get(props.careerId))
        )
      );
    else setData(noData());

    if (tempApproved.has(careersMap.get(props.graphsCareerId)))
      setData(
        genData(
          tempApproved.get(careersMap.get(props.graphsCareerId)),
          tempRejected.get(careersMap.get(props.graphsCareerId))
        )
      );
    else if (props.graphsCareerId === DEFAULT_CAREER) {
      setData(
        genData(
          tempApproved.get('Todas las carreras'),
          tempRejected.get('Todas las carreras')
        )
      );
    } else setData(noData());
  }, [props.graphsCareerId, careers, applications]);

  useEffect(() => setLoaded(!!data), [data]);

  return loaded ? <Pie data={data} /> : <CircularProgress />;
}

export default PieChart;
