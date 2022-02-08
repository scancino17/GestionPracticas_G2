import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { CircularProgress, Grid } from '@material-ui/core';
import { useSupervisor } from '../../../../providers/Supervisor';

const columns = [
  { field: 'country', headerName: 'País', flex: 1 },
  { field: 'interns', headerName: 'Total Practicantes', flex: 1 }
];

function TableChart({ setExportable }) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { applications } = useSupervisor();

  useEffect(() => {
    const countryCounter = new Map();

    applications
      .filter((item) => item.status === 'Aprobado')
      .forEach((doc) => {
        if (doc.País) {
          if (countryCounter.has(doc.País)) {
            let counter = countryCounter.get(doc.País);
            countryCounter.set(doc.País, counter + 1);
          } else {
            countryCounter.set(doc.País, 1);
          }
        }
      });

    setExportable([
      Array.from(countryCounter.keys()),
      [Object.fromEntries(countryCounter)]
    ]);

    let entries = Array.from(countryCounter.entries());

    const rows = [];
    let i = 0;

    entries.forEach((entry) => {
      rows.push({ id: i, country: entry[0], interns: entry[1] });
      i++;
    });

    setData(rows);
  }, [applications, setExportable]);

  useEffect(() => setLoaded(!!data), [data]);

  return (
    <Grid container>
      {/*
      <Grid item xs={12} sm={6} md={6}>
        
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <img src='AdminTable.jpg' alt='Faceless Animation' width='100%' />
      </Grid>
*/}
      {loaded ? (
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          autoHeight={true}
          columnBuffer={2}
        />
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
}

export default TableChart;
