import React, { useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { useSupervisor } from '../../../../providers/Supervisor';
import { DEFAULT_CAREER } from '../../../../providers/User';

const NO_CAREER = 'Otras carreras';

function GroupedBar({ setExportable }) {
  const { students, careers } = useSupervisor();
  const [loaded, setLoaded] = useState(false);

  const options = {
    maintainAspectRatio: false
  };

  // Mapa de carreras, las keys son el código de la carrera,
  // los values son el nombre. Si este excede 34 caracteres, se corta
  const careersMap = useMemo(() => {
    const map = new Map();
    careers
      .filter((item) => item.id !== DEFAULT_CAREER)
      .forEach((item) =>
        map.set(
          item.id,
          item.name.length > 34 ? `${item.name.slice(0, 34)}...` : item.name
        )
      );
    return map;
  }, [careers]);

  const { graphData, listData } = useMemo(() => {
    if (!careersMap || !students) return null;
    // Los keys de estos mapas son el nombre de la carrera.
    // Los valores son la cuenta de cuantos estudiantes de la carrera key se encuentran en cada paso.
    const noAction = new Map();
    const applying = new Map();
    const onIntern = new Map();

    careersMap.forEach((value) => {
      noAction.set(value, 0);
      applying.set(value, 0);
      onIntern.set(value, 0);
    });

    // En caso de que haya estudiantes que pertenezcan a una carrera que no se encuentre en el sistema
    noAction.set(NO_CAREER, 0);
    applying.set(NO_CAREER, 0);
    onIntern.set(NO_CAREER, 0);

    // Por cada estudiante, agregar al paso que le corresponde.
    // Si no está en ningun paso, se asume que está en el paso 0 (practica disponible)
    students.forEach((doc) => {
      // Obtener key correspondiente, si no existe, usar DEFAULT_CAREER como key
      let key = careersMap.has(doc.careerId)
        ? careersMap.get(doc.careerId)
        : careersMap.get(NO_CAREER);
      let counter;

      // Agregar al paso que corresponde
      if (doc.step) {
        switch (doc.step) {
          case 0:
            counter = noAction.get(key);
            noAction.set(key, counter + 1);
            break;
          case 1:
            counter = applying.get(key);
            applying.set(key, counter + 1);
            break;
          case 2:
            counter = onIntern.get(key);
            onIntern.set(key, counter + 1);
            break;
          default:
            break;
        }
      } else {
        counter = noAction.get(key);
        noAction.set(key, counter + 1);
      }
    });

    // Si todos los estudiantes pertenecen a una carrera del sistema, eliminar esta entrada
    if (
      noAction.get(NO_CAREER) === 0 &&
      applying.get(NO_CAREER) === 0 &&
      onIntern.get(NO_CAREER) === 0
    ) {
      noAction.delete(NO_CAREER);
      applying.delete(NO_CAREER);
      onIntern.delete(NO_CAREER);
    }

    // Preparar datos y entregar a padre, para poder ser exportado como xslx
    let listData = [
      Array.from(noAction.keys()),
      [
        Object.fromEntries(noAction),
        Object.fromEntries(applying),
        Object.fromEntries(onIntern)
      ]
    ];

    // Transformar datos a formato requerido por grafico
    let graphData = {
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

    return { graphData, listData };
  }, [careersMap, students]);

  useEffect(() => setLoaded(!!graphData), [graphData]);

  useEffect(() => {
    if (listData) setExportable(listData);
  }, [listData, setExportable]);

  return loaded ? (
    <Bar data={graphData} options={options} />
  ) : (
    <CircularProgress />
  );
}

export default GroupedBar;
