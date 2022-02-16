import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSupervisor } from '../../../../providers/Supervisor';

function VerticalBar({ setExportable }) {
  const [data, setData] = useState();
  const [loaded, setLoaded] = useState(false);
  const { applications } = useSupervisor();

  useEffect(() => {
    let companyCounter = new Map();

    applications
      .filter((item) => item.status === 'Aprobado')
      .forEach((doc) => {
        if (companyCounter.has(doc.Empresa)) {
          let counter = companyCounter.get(doc.Empresa);
          companyCounter.set(doc.Empresa, counter + 1);
        } else {
          companyCounter.set(doc.Empresa, 1);
        }
      });

    setExportable([
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
            '#375C8C',
            'rgba(54, 162, 235, 1)',

            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };

    setData(config);
  }, [applications, setExportable]);

  const options = {
    maintainAspectRatio: false
  };

  useEffect(() => setLoaded(!!data), [data]);

  return loaded ? <Bar data={data} options={options} /> : <CircularProgress />;
}

export default VerticalBar;
