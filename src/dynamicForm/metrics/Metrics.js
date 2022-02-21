import {
  CircularProgress,
  Grid,
  Typography,
  Divider,
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  CardActions,
  Button
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DataGrid } from '@material-ui/data-grid';

import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';
import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';
import { useSupervisor } from '../../providers/Supervisor';
import { useUser } from '../../providers/User';
import CareerSelector from '../../utils/CareerSelector';
import { FormTypes } from '../camps/FormTypes';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';
import ExcelExporter from '../../utils/ExcelExporter';
import { MdFileDownload } from 'react-icons/md';

function Metrics() {
  const { careerId } = useUser();
  const [selectedCareerId, setSelectedCareerId] = useState(careerId);
  const [formFull, setFormFull] = useState();
  const { getForm } = useSupervisor();

  useEffect(() => {
    if (selectedCareerId !== 'general') {
      getForm(FormTypes.EvaluationForm, selectedCareerId).then((careerForm) => {
        setFormFull(careerForm);
      });
    }
  }, [selectedCareerId, getForm]);

  return (
    <Grid container direction='column' style={{ marginLeft: 20 }}>
      <Grid item sx={6}>
        <Typography>Metricas</Typography>
        <CareerSelector
          careerId={selectedCareerId}
          setCareerId={setSelectedCareerId}
          excludeGeneral
        />
      </Grid>

      <Grid item container spacing={2}>
        {formFull &&
          selectedCareerId !== 'general' &&
          formFull.map((step, stepIndex) =>
            step.form.map(
              (camp) =>
                camp.type === 'Menú de opciones' ||
                (camp.type === 'Medidor satisfacción' && (
                  <Grid item xs={12} md={4} style={{ marginBottom: '1rem' }}>
                    <Chart step={stepIndex} name={camp.name} />
                  </Grid>
                ))
            )
          )}
      </Grid>
    </Grid>
  );

  function Chart({ step, name }) {
    const columns = [
      { field: 'name', headerName: 'Nombre', flex: 1 },
      { field: 'count', headerName: 'Total', flex: 1 }
    ];
    const colors = [
      'rgba(52, 92, 140, 1)',
      'rgba(76, 196, 196, 1)',
      'rgba(52, 164, 236, 1)',
      'rgba(92, 180, 236, 1)'
    ];
    const [data, setData] = useState([]);
    const [dataBarChart, setDataBarChart] = useState([]);
    const [dataPieChart, setDataPieChart] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { evaluations } = useSupervisor();

    useEffect(() => {
      const selectCounter = new Map();

      //cargar opciones predefinidas en los casos en los que se puedan calcular
      formFull[step].form.map((camp) => {
        if (
          camp.options &&
          camp.name === name &&
          (camp.type === 'Medidor satisfacción' ||
            camp.type === 'Menú de opciones')
        ) {
          camp.options.map((option) => selectCounter.set(option, 0));
        }
      });

      evaluations
        .filter((item) => item.careerId === selectedCareerId)
        .forEach((doc) => {
          if (doc.form[step]) {
            doc.form[step].form.map((camp) => {
              // contador datos normales
              if (
                camp.name === name &&
                (camp.type === 'Medidor satisfacción' ||
                  camp.type === 'Menú de opciones')
              ) {
                if (selectCounter.has(camp.value)) {
                  let counter = selectCounter.get(camp.value);
                  selectCounter.set(camp.value, counter + 1);
                }
              }
            });
          }
        });

      var entries = Array.from(selectCounter.entries());

      const rows = [];
      let i = 0;

      //parseo de los datos en label y datos
      entries.forEach((entry) => {
        rows.push({ id: i, name: entry[0], count: entry[1] });
        i++;
      });

      //setedo de los datos del grafico de barras
      let config = {
        labels: rows.map((label) => {
          return label.name;
        }),
        datasets: [
          {
            label: name,
            data: rows.map((label) => {
              return label.count;
            }),
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }
        ]
      };

      //seteo datos grafico de pastel
      const dataPie = {
        labels: rows.map((label) => {
          return label.name;
        }),
        datasets: [
          {
            label: name,
            data: rows.map((label) => {
              return label.count;
            }),
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }
        ]
      };

      setDataPieChart(dataPie);
      setData(rows);
      setDataBarChart(config);
      setLoaded(true);
    }, [evaluations, name, step]);

    const optionsBarChart = {
      maintainAspectRatio: false
    };
    const [typeChart, setTypeChart] = useState(1);
    function ExportarExcel() {
      return (
        <ExcelFile
          element={
            <Button
              fullWidth
              color='primary'
              variant='text'
              startIcon={<MdFileDownload />}>
              Exportar datos
            </Button>
          }
          filename={name}>
          <ExcelSheet data={data} name='Estudiantes para seguro'>
            <ExcelColumn label='opcion' value='name' />
            <ExcelColumn label='cantidad' value='count' />
          </ExcelSheet>
        </ExcelFile>
      );
    }

    return (
      <Card xs={12}>
        <CardHeader title={name} />
        <Divider />
        <CardContent>
          {loaded ? (
            <>
              {typeChart === 0 && (
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={5}
                  autoHeight={true}
                  columnBuffer={2}
                />
              )}
              {typeChart === 1 && (
                <Bar data={dataBarChart} options={optionsBarChart} />
              )}
              {typeChart === 2 && <Pie data={dataPieChart} />}
            </>
          ) : (
            <CircularProgress />
          )}
        </CardContent>
        <Divider />
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ExportarExcel />
        </CardActions>
      </Card>
    );
  }
}
export default Metrics;
