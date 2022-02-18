import React, { useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';
import { useSupervisor } from '../../../../providers/Supervisor';
import { DEFAULT_CAREER } from '../../../../providers/User';

const NO_CAREER = 'Otras carreras';

const genData = (approved, rejected) => ({
  labels: ['Aprobados', 'Rechazados'],
  datasets: [
    {
      label: 'Estado',
      data: [approved, rejected],
      backgroundColor: ['rgba(75, 192, 192, 1)', '#375C8C'],
      borderColor: ['rgba(75, 192, 192, 1)', '#375C8C'],
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

function PieChart({ graphsCareerId, setExportable }) {
  const [loaded, setLoaded] = useState(false);
  const { applications, careers } = useSupervisor();

  const { graphData, listData } = useMemo(() => {
    // Mapa de carreras, las keys son el código de la carrera,
    // los values son el nombre.
    const careersMap = new Map();
    careers.forEach((career) => careersMap.set(career.id, career.name));

    // Los keys de estos mapas son el nombre de la carrera.
    // Los values son la cuenta de cuantas postulaciones se encuentran
    // en el correspondiente estado
    const tempApproved = new Map();
    const tempRejected = new Map();

    careersMap.forEach((value) => {
      tempApproved.set(value, 0);
      tempRejected.set(value, 0);
    });

    // En caso de que haya postulaciones que pertenezcan a una carrera
    // que no se encuentra en el sistema
    tempApproved.set(NO_CAREER, 0);
    tempRejected.set(NO_CAREER, 0);

    // Por cada postulación, agregar al contador de cada estado,
    // por carrera y en general
    applications.forEach((doc) => {
      let key = careersMap.has(doc.careerId)
        ? careersMap.get(doc.careerId)
        : careersMap.get(NO_CAREER);
      let counter;

      switch (doc.status) {
        case 'Aprobado':
          counter = tempApproved.get(key);
          tempApproved.set(key, counter + 1);
          tempApproved.set(
            careersMap.get(DEFAULT_CAREER),
            tempApproved.get(careersMap.get(DEFAULT_CAREER)) + 1
          );
          break;
        case 'Rechazado':
          counter = tempRejected.get(key);
          tempRejected.set(key, counter + 1);
          tempRejected.set(
            careersMap.get(DEFAULT_CAREER),
            tempRejected.get(careersMap.get(DEFAULT_CAREER)) + 1
          );
          break;
        default:
          break;
      }
    });

    // Si todas las postulaciones pertenecen a una carrera que
    // existe en el sistema, eliminar esta entrada
    if (
      tempApproved.get(NO_CAREER) === 0 &&
      tempRejected.get(NO_CAREER) === 0
    ) {
      tempApproved.delete(NO_CAREER);
      tempRejected.delete(NO_CAREER);
    }

    // Preparar datos para enntrgar a padre
    const listData = [
      Array.from(tempApproved.keys()),
      [Object.fromEntries(tempApproved), Object.fromEntries(tempRejected)]
    ];

    // Preparar datos para grafico
    let graphData = noData();
    if (careersMap.has(graphsCareerId)) {
      let key = careersMap.get(graphsCareerId);
      graphData = genData(tempApproved.get(key), tempRejected.get(key));
    }

    return { graphData, listData };
  }, [applications, careers, graphsCareerId]);

  useEffect(() => setLoaded(!!graphData), [graphData]);

  useEffect(() => {
    if (listData) setExportable(listData);
  }, [listData, setExportable]);

  return loaded ? <Doughnut data={graphData} /> : <CircularProgress />;
}

export default PieChart;
