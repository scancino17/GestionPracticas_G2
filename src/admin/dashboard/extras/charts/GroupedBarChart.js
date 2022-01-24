import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { DEFAULT_CAREER } from '../../../../providers/User';
import { useSupervisor } from '../../../../providers/Supervisor';

function GroupedBar(props) {
  const { students, careers } = useSupervisor();
  const [data, setData] = useState();
  const [loaded, setLoaded] = useState(false);
  let careersMap = new Map();
  let noAction = new Map();
  let applying = new Map();
  let onIntern = new Map();

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

  function standardizeMaps(doc) {
    if (!noAction.has(careersMap.get(doc.careerId)))
      noAction.set(careersMap.get(doc.careerId), 0);
    if (!applying.has(careersMap.get(doc.careerId)))
      applying.set(careersMap.get(doc.careerId), 0);
    if (!onIntern.has(careersMap.get(doc.careerId)))
      onIntern.set(careersMap.get(doc.careerId), 0);
  }

  function getStudentsStatus() {
    students.forEach((doc) => {
      if (doc.step) {
        switch (doc.step) {
          case 0:
            if (noAction.has(careersMap.get(doc.careerId))) {
              let counter = noAction.get(careersMap.get(doc.careerId));
              noAction.set(careersMap.get(doc.careerId), counter + 1);
            } else {
              noAction.set(careersMap.get(doc.careerId), 1);
            }
            standardizeMaps(doc);
            break;
          case 1:
            if (applying.has(careersMap.get(doc.careerId))) {
              let counter = applying.get(careersMap.get(doc.careerId));
              applying.set(careersMap.get(doc.careerId), counter + 1);
            } else {
              applying.set(careersMap.get(doc.careerId), 1);
            }
            standardizeMaps(doc);
            break;
          case 2:
            if (onIntern.has(careersMap.get(doc.careerId))) {
              let counter = onIntern.get(careersMap.get(doc.careerId));
              onIntern.set(careersMap.get(doc.careerId), counter + 1);
            } else {
              onIntern.set(careersMap.get(doc.careerId), 1);
            }
            standardizeMaps(doc);
            break;
          default:
            break;
        }
      } else {
        if (noAction.has(careersMap.get(doc.careerId))) {
          let counter = noAction.get(careersMap.get(doc.careerId));
          noAction.set(careersMap.get(doc.careerId), counter + 1);
        } else {
          noAction.set(careersMap.get(doc.careerId), 1);
        }
        standardizeMaps(doc);
      }
    });

    let list = [
      Array.from(noAction.keys()),
      [
        Object.fromEntries(noAction),
        Object.fromEntries(applying),
        Object.fromEntries(onIntern)
      ]
    ];

    props.setExportable(list);

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
          data: Array.from(onIntern.values()),
          backgroundColor: 'rgb(75, 192, 192)'
        }
      ]
    };

    setData(config);
  }

  useEffect(() => {
    careers.forEach((career) => {
      if (career.id !== DEFAULT_CAREER) {
        careersMap.set(
          career.id,
          career.name.length > 34
            ? `${career.name.slice(0, 34)}...`
            : career.name
        );
      }
    });

    getStudentsStatus();
  }, [careers]);

  useEffect(() => setLoaded(!!data), [data]);

  return loaded ? <Bar data={data} options={options} /> : <CircularProgress />;
}

export default GroupedBar;
