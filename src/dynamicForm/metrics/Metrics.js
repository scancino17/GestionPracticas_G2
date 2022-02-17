import {
  CircularProgress,
  Grid,
  Box,
  Typography,
  Divider
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { map } from 'draft-js/lib/DefaultDraftBlockRenderMap';
import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useSupervisor } from '../../providers/Supervisor';
import { useUser } from '../../providers/User';
import CareerSelector from '../../utils/CareerSelector';

function Metrics() {
  const { careerId } = useUser();
  const [selectedCareerId, setSelectedCareerId] = useState(careerId);
  const [formFull, setFormFull] = useState();
  const { getCareerForm, getSurveyForm, getEvaluateForm } = useSupervisor();

  useEffect(() => {
    getCareerForm(selectedCareerId).then((careerForm) =>
      setFormFull(careerForm)
    );
  }, [selectedCareerId]);

  return (
    <Grid style={{ marginLeft: 20 }}>
      <Typography>Metricas</Typography>
      <CareerSelector
        careerId={selectedCareerId}
        setCareerId={setSelectedCareerId}
        excludeGeneral
      />
      {formFull &&
        formFull.map((step, stepIndex) =>
          step.form.map((camp) => (
            <Grid container direction='row'>
              {camp.type === 'Menú de opciones' && (
                <Grid item style={{ marginBottom: '6rem' }}>
                  <Typography variant='h4'>{camp.name}</Typography>
                  <Chart step={stepIndex} name={camp.name} />
                  <Divider />
                </Grid>
              )}
              {camp.type === 'Medidor satisfacción' && (
                <Grid item style={{ marginBottom: '6rem' }}>
                  <Typography variant='h4'>{camp.name}</Typography>
                  <Chart step={stepIndex} name={camp.name} />
                  <Divider />
                </Grid>
              )}
              {camp.type === 'Campos predefinidos' &&
                camp.type2 === 'Fecha de inicio' && (
                  <Grid item style={{ marginBottom: '6rem' }}>
                    <Typography variant='h4'>{camp.name}</Typography>
                    <Chart step={stepIndex} name={camp.name} />
                    <Divider />
                  </Grid>
                )}
            </Grid>
          ))
        )}
    </Grid>
  );

  function Chart({ step, name }) {
    const columns = [
      { field: 'name', headerName: 'Nombre', flex: 1 },
      { field: 'count', headerName: 'Total', flex: 1 }
    ];
    const [data, setData] = useState([]);
    const [dataBarChart, setDataBarChart] = useState([]);
    const [dataPieChart, setDataPieChart] = useState([]);
    const [dataLineChart, setDataLineChart] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { applications } = useSupervisor();

    useEffect(() => {
      const selectCounter = new Map();

      //cargar opciones predefinidas en los casos en los que se puedan calcular
      formFull[step].form.map((camp) => {
        if (
          camp.name === name &&
          (camp.type === 'Medidor satisfacción' ||
            camp.type === 'Menú de opciones')
        ) {
          camp.options.map((option) => selectCounter.set(option, 0));
        }
      });

      applications
        .filter(
          (item) =>
            item.status === 'Aprobado' && item.careerId === selectedCareerId
        )
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

              // contador datos fechas
              else if (
                camp.type === 'Campos predefinidos' &&
                camp.name === name &&
                (camp.type2 === 'Fecha de inicio' ||
                  camp.type2 === 'Fecha de término')
              ) {
                var dateAux = camp.value.toDate();

                if (selectCounter.has(dateAux)) {
                  let counter = selectCounter.get(dateAux);
                  selectCounter.set(dateAux, counter + 1);
                } else {
                  selectCounter.set(dateAux, 1);
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

      //ordenar fechas
      if (name === 'Fecha de inicio' || name === 'Fecha de término') {
        rows.sort(function (a, b) {
          var nameA = a.name;
          var nameB = b.name;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
        //add dates

        var newDates = getDaysArray(rows[0].name, rows[rows.length - 1].name);
        newDates.map((date) => {
          if (selectCounter.has(date)) {
          } else {
            selectCounter.set(date, 0);
          }
        });

        entries = Array.from(selectCounter.entries());
        entries.forEach((entry) => {
          rows.push({ id: i, name: entry[0], count: entry[1] });
          i++;
        });
        //re-format dates
        rows.sort(function (a, b) {
          var nameA = a.name;
          var nameB = b.name;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        for (let i = 0; i < rows.length; i++) {
          rows[i].name =
            rows[i].name.getDate() +
            '/' +
            (rows[i].name.getMonth() + 1) +
            '/' +
            rows[i].name.getFullYear();
          // more statements
        }
        console.log(rows);
      }

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
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
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
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      };
      ///line data set
      const dataLine = {
        labels: rows.map((label) => {
          return label.name;
        }),
        datasets: [
          {
            label: 'Dataset 1',
            data: rows.map((label) => {
              return label.count;
            }),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)'
          }
        ]
      };

      setDataLineChart(dataLine);
      setDataPieChart(dataPie);
      setData(rows);
      setDataBarChart(config);
    }, [applications]);

    function getDaysArray(start, end) {
      for (
        var arr = [], dt = new Date(start);
        dt <= end;
        dt.setDate(dt.getDate() + 1)
      ) {
        arr.push(new Date(dt));
      }
      return arr;
    }
    const optionsBarChart = {
      maintainAspectRatio: false
    };

    const optionsLine = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      elements: {
        line: {
          tension: 0.5 // disables bezier curves
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'MMM DD'
            },
            gridLines: {
              display: false
            }
          }
        ]
      }
    };
    useEffect(() => setLoaded(!!data), [data]);

    return (
      <>
        {loaded ? (
          <Grid container direction='column'>
            <Grid container direction='row'>
              <Grid item xs={4}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  pageSize={5}
                  autoHeight={true}
                  columnBuffer={2}
                />
              </Grid>
              <Grid item xs={4}>
                <Bar data={dataBarChart} options={optionsBarChart} />
              </Grid>
              <Grid item xs={4}>
                <Pie data={dataPieChart} />
              </Grid>
            </Grid>
            <Grid item xs={10}>
              <Box sx={{ width: 1000, height: 400 }}>
                <Line options={optionsLine} data={dataLineChart} />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <CircularProgress />
        )}
      </>
    );
  }
}
export default Metrics;
