import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Grid } from '@material-ui/core';
import { db } from '../../../../firebase';
import useAuth from '../../../../providers/Auth';
const columns = [
  { field: 'country', headerName: 'País', flex: 1 },
  { field: 'interns', headerName: 'Total Practicantes', flex: 1 }
];

function TableChart(props) {
  const [data, setData] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const dbRef = user.careerId
      ? db.collection('applications').where('careerId', '==', user.careerId)
      : db.collection('applications');
    const unsubscribe = dbRef
      .where('status', '==', 'Aprobado')
      .onSnapshot((querySnapshot) => {
        let countryCounter = new Map();
        const temp = [];

        querySnapshot.forEach((doc) =>
          temp.push({ id: doc.id, ...doc.data() })
        );

        temp.forEach((doc) => {
          if (doc.País) {
            if (countryCounter.has(doc.País)) {
              let counter = countryCounter.get(doc.País);
              countryCounter.set(doc.País, counter + 1);
            } else {
              countryCounter.set(doc.País, 1);
            }
          }
        });

        props.setExportable([
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
      });
    return unsubscribe;
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={6}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          autoHeight={true}
          columnBuffer={2}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <img src='AdminTable.jpg' alt='Faceless Animation' width='100%' />
      </Grid>
    </Grid>
  );
}

export default TableChart;
