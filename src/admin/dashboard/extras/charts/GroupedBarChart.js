import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { db } from '../../../../firebase';
import useAuth from '../../../../providers/Auth';

function GroupedBar(props) {
  const { user } = useAuth();
  const [data, setData] = useState();
  const [loaded, setLoaded] = useState(false);
  let careers = new Map();
  let noAction = new Map();
  let applying = new Map();
  let onIntern = new Map();

  const options = {
    maintainAspectRatio: false
  };

  function standardizeMaps(doc) {
    if (!noAction.has(careers.get(doc.careerId)))
      noAction.set(careers.get(doc.careerId), 0);
    if (!applying.has(careers.get(doc.careerId)))
      applying.set(careers.get(doc.careerId), 0);
    if (!onIntern.has(careers.get(doc.careerId)))
      onIntern.set(careers.get(doc.careerId), 0);
  }

  function getStudentsStatus() {
    const dbRef = user.careerId
      ? db.collection('users').where('careerId', '==', user.careerId)
      : db.collection('users');
    const unsubscribe = dbRef.onSnapshot((querySnapshot) => {
      const temp = [];

      querySnapshot.forEach((doc) => temp.push({ id: doc.id, ...doc.data() }));

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
              standardizeMaps(doc);
              break;
            case 1:
              if (applying.has(careers.get(doc.careerId))) {
                let counter = applying.get(careers.get(doc.careerId));
                applying.set(careers.get(doc.careerId), counter + 1);
              } else {
                applying.set(careers.get(doc.careerId), 1);
              }
              standardizeMaps(doc);
              break;
            case 2:
              if (onIntern.has(careers.get(doc.careerId))) {
                let counter = onIntern.get(careers.get(doc.careerId));
                onIntern.set(careers.get(doc.careerId), counter + 1);
              } else {
                onIntern.set(careers.get(doc.careerId), 1);
              }
              standardizeMaps(doc);
              break;
            default:
              break;
          }
        } else {
          if (noAction.has(careers.get(doc.careerId))) {
            let counter = noAction.get(careers.get(doc.careerId));
            noAction.set(careers.get(doc.careerId), counter + 1);
          } else {
            noAction.set(careers.get(doc.careerId), 1);
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
    });
    return unsubscribe;
  }

  useEffect(() => {
    let unsubscribe = null;
    db.collection('careers')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id !== 'general')
            careers.set(
              doc.id,
              data.name.length > 34 ? `${data.name.slice(0, 34)}...` : data.name
            );
        });
        unsubscribe = getStudentsStatus();
      });
    return unsubscribe;
  }, []);

  useEffect(() => setLoaded(!!data), [data]);

  return loaded ? <Bar data={data} options={options} /> : <CircularProgress />;
}

export default GroupedBar;
