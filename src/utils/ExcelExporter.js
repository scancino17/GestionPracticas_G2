import React from 'react';
import ReactExport from 'react-export-excel';
import { MdFileDownload } from 'react-icons/md';
import styles from '../admin/dashboard/extras/assets/jss/material-dashboard-react/views/dashboardStyle';
import { makeStyles } from '@material-ui/core';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExcelExporter(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <ExcelFile
      filename={props.filename}
      element={
        <div style={{ cursor: 'pointer' }} className={classes.stats}>
          <MdFileDownload />
          Exportar datos
        </div>
      }>
      {props.data.slice(1).map((dataset) => {
        return (
          <ExcelSheet data={dataset} name='Single Page'>
            {props.data[0].map((col) => {
              return <ExcelColumn label={col} value={col} />;
            })}
          </ExcelSheet>
        );
      })}
    </ExcelFile>
  );
}

export default ExcelExporter;
