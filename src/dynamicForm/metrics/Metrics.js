import {
  CircularProgress,
  Grid,
  Typography,
  Divider,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Box
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';

import { DataGrid } from '@material-ui/data-grid';

import React, { useEffect, useMemo, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';
import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';
import { useSupervisor } from '../../providers/Supervisor';
import { useUser } from '../../providers/User';
import CareerSelector from '../../utils/CareerSelector';
import { FormTypes } from '../camps/FormTypes';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';
import { MdFileDownload } from 'react-icons/md';
import DateFnsUtils from '@date-io/date-fns';

import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';

function Metrics() {
  const { careerId } = useUser();
  const [selectedCareerId, setSelectedCareerId] = useState(careerId);
  const [formFull, setFormFull] = useState();
  const [evaluation, setEvaluation] = useState(true);
  const { getForm, careers } = useSupervisor();
  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState(
    new Date(new Date() - 1000 * 60 * 60 * 24 * 30 * 2)
  );
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (selectedCareerId !== 'general') {
      getForm(
        evaluation ? FormTypes.EvaluationForm : FormTypes.SurveyForm,
        selectedCareerId
      ).then((form) => {
        setFormFull(form);
      });
    }
  }, [selectedCareerId, getForm, careers, evaluation]);

  const handleChangeTab = (event, newValue) => {
    event.preventDefault();
    setSelectedTab(newValue);
    setEvaluation(newValue ? false : true);
  };
  return (
    <>
      <Grid container direction='row'>
        <Grid
          item
          xs={12}
          style={{
            backgroundImage: "url('AdminBanner-Form.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '2rem'
          }}>
          <Typography component={'span'} variant='h4'>
            Métricas
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Tabs
            variant='scrollable'
            scrollButtons
            allowScrollButtonsMobile
            value={selectedTab}
            onChange={handleChangeTab}
            aria-label='wrapped label tabs example'>
            <Tab value={0} label='Formulario de Evaluacion' />
            <Tab value={1} label='Formulario de encuesta de satisfacción' />
          </Tabs>
          <Divider />
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            marginTop: '2rem',
            marginLeft: '2rem',
            marginRight: '2rem'
          }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <CareerSelector
                careerId={selectedCareerId}
                setCareerId={setSelectedCareerId}
                excludeGeneral
              />
            </Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item xs={12} sm={2}>
                <DatePicker
                  fullWidth
                  disableToolbar
                  variant='inline'
                  format='dd/MM/yyyy'
                  label={'Fecha inicio'}
                  value={startDate}
                  onChange={(date) => setStartDate(new Date(date))}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <DatePicker
                  fullWidth
                  disableToolbar
                  variant='inline'
                  format='dd/MM/yyyy'
                  label={'Fecha Fin'}
                  value={endDate}
                  onChange={(date) => setEndDate(new Date(date))}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>

        <Grid
          item
          container
          spacing={2}
          style={{
            marginTop: '2rem',
            marginLeft: '1rem',
            marginRight: '1rem'
          }}>
          {formFull &&
            selectedCareerId !== 'general' &&
            formFull.map((step, stepIndex) =>
              step.form.map(
                (camp) =>
                  camp.type === 'Menú de opciones' ||
                  (camp.type === 'Medidor satisfacción' && (
                    <Grid
                      key={camp.name}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{ marginBottom: '1rem' }}>
                      <Chart step={stepIndex} name={camp.name} />
                    </Grid>
                  ))
              )
            )}
        </Grid>
      </Grid>
    </>
  );

  function Chart({ step, name }) {
    const columns = [
      { field: 'name', headerName: 'Nombre', flex: 1 },
      { field: 'count', headerName: 'Total', flex: 1 }
    ];

    const [typeChart, setTypeChart] = useState('bar');
    const [data, setData] = useState([]);
    const [dataChart, setDataChart] = useState([]);

    const [loaded, setLoaded] = useState(false);
    const { evaluations, surveys } = useSupervisor();

    const filteredEvaluationList = useMemo(() => {
      let list = evaluation ? evaluations : surveys;
      if (list) {
        let filtered = list.slice();

        if (selectedCareerId !== 'general') {
          filtered = filtered.filter(
            (item) => item.careerId === selectedCareerId
          );
        }
        filtered = filtered.filter(
          (item) => item.careerId === selectedCareerId
        );
        filtered = filtered.filter(
          (item) =>
            item.sentTime &&
            item.sentTime.seconds * 1000 <= endDate &&
            item.sentTime.seconds * 1000 >= startDate
        );

        return filtered;
      } else return [];
    }, [evaluations]);

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

      filteredEvaluationList.forEach((doc) => {
        if (doc.form[step]) {
          doc.form[step].form.map((camp) => {
            if (camp.name === name) {
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

      //parseo de los datos en label y datos
      entries.forEach((entry, i) => {
        rows.push({ id: i, name: entry[0], count: entry[1] });
        i++;
      });

      let colors = [
        'rgba(52, 92, 140, 1)',
        'rgba(76, 196, 196, 1)',
        'rgba(52, 164, 236, 1)',
        'rgba(92, 180, 236, 1)'
      ];
      //seteo datos graficos
      const dataChart = {
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

      setDataChart(dataChart);
      setData(rows);
      setLoaded(true);
    }, [evaluations, filteredEvaluationList, name, step]);

    const optionsBarChart = {
      plugins: { legend: { display: false } },
      maintainAspectRatio: false
    };
    const optionsPieChart = {
      plugins: { legend: { position: 'right' } },
      maintainAspectRatio: false
    };

    function ExportarExcel() {
      function careerName(code) {
        for (let index = 0; index < careers.length; index++) {
          if (careers[index].id === code) return careers[index].name;
        }
      }
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
          filename={
            name +
            ' (' +
            startDate.toLocaleDateString('es-CL') +
            ' / ' +
            endDate.toLocaleDateString('es-CL') +
            ')' +
            careerName(selectedCareerId)
          }>
          <ExcelSheet data={data} name='export'>
            <ExcelColumn label='opcion' value='name' />
            <ExcelColumn label='cantidad' value='count' />
          </ExcelSheet>
        </ExcelFile>
      );
    }

    const handleTypeChart = (event, newAlignment) => {
      if (newAlignment !== null) {
        setTypeChart(newAlignment);
      }
    };
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
              {typeChart === 'bar' && (
                <Bar data={dataChart} options={optionsBarChart} />
              )}
              {typeChart === 'pie' && (
                <Pie data={dataChart} options={optionsPieChart} />
              )}
            </>
          ) : (
            <CircularProgress />
          )}
        </CardContent>
        <Divider />
        <CardActions
          style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ToggleButtonGroup
            value={typeChart}
            exclusive
            onChange={handleTypeChart}
            aria-label='text alignment'>
            <ToggleButton value='bar' aria-label='Pastel'>
              <BarChartIcon />
            </ToggleButton>
            <ToggleButton value='pie' aria-label='Barra'>
              <PieChartIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <ExportarExcel />
        </CardActions>
      </Card>
    );
  }
}
export default Metrics;
