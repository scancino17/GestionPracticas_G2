import { MdUpdate } from 'react-icons/md';
import ArchiveIcon from '@material-ui/icons/Archive';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BusinessIcon from '@material-ui/icons/Business';
import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ApplicationsList from '../applications/ApplicationsList';
import BarraLateral from '../../layout/BarraLateral';
import CountUp from 'react-countup';
import InternshipIntention from '../intention/InternshipIntention';

import styles from './extras/assets/jss/material-dashboard-react/views/dashboardStyle';
import {
  Container,
  Grid,
  makeStyles,
  Select,
  Typography,
  Divider
} from '@material-ui/core';

import { Avatar, Box, Card, CardContent, CardHeader } from '@mui/material';

import WarningIcon from '@material-ui/icons/Warning';

import ApplicationCheck from '../../dynamicForm/check/ApplicationCheck';
import VerticalBar from './extras/charts/VerticalBar';
import PieChart from './extras/charts/PieChart';
import TableChart from './extras/charts/TableChart';
import GroupedBarChart from './extras/charts/GroupedBarChart';
import ImportStudents from '../import/ImportStudents';

import Insurance from '../insurance/Insurance';
import CareerSelector from '../../utils/CareerSelector';
import ReportsList from '../assessReports/ReportsList';
import AssessReport from '../assessReports/AssessReport';
import ExtensionList from '../extension/ExtensionList';
import CareersSettings from '../careersSettings/CareersSettings';
import SupervisorManagement from '../supervisorManagement/SupervisorManagement';
import ExcelExporter from '../../utils/ExcelExporter';
import { useUser, DEFAULT_CAREER, ADMIN_ROLE } from '../../providers/User';
import ControlPanel from '../../utils/ControlPanel';

// La siguiente línea registra todos los elementos de chart.js
// No es inútil: eliminarla rompera TODOS los gráficos al recargar los gráficos.
// eslint-disable-next-line no-unused-vars
import Chart from 'chart.js/auto';

import { useSupervisor } from '../../providers/Supervisor';
import RemarkList from '../remarks/RemarkList';
import SelectEdit from '../../dynamicForm/SelectEdit';

import Metrics from '../../dynamicForm/metrics/Metrics';

import EvaluationsList from '../evaluations/EvaluationsList';
import SurveyList from '../evaluations/SurveyList';
import EvaluationCheck from '../../dynamicForm/check/EvaluationCheck';
import SurveyCheck from '../../dynamicForm/check/SurveyCheck';

function DashboardAdmin({ sidebarProps }) {
  const { careerId, userRole } = useUser();

  const navigate = useNavigate();
  const [topCompaniesRegistered, setTopCompaniesRegistered] = useState([]);
  const [internStatus, setInternStatus] = useState([]);
  const [internCountries, setInternCountries] = useState([]);
  const [applicationsStatus, setApplicationsStatus] = useState([]);
  const [graphsCareerId, setGraphsCareerId] = useState(careerId);

  const {
    pendingIntentionsCount,
    pendingFormsCount,
    sentReportsCount,
    ongoingInternshipsCount
  } = useSupervisor();

  return (
    <div style={{ display: 'flex' }}>
      <BarraLateral {...sidebarProps} />
      <Routes>
        <Route
          exact
          path='/'
          element={
            <Box
              component='main'
              sx={{
                flexGrow: 1,
                py: 8
              }}>
              <Container style={{ marginTop: '1rem' }} maxWidth={false}>
                <Grid container spacing={3}>
                  <Grid item lg={3} sm={6} xl={3} xs={12}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Grid
                          container
                          sx={{ justifyContent: 'space-between' }}>
                          <Grid
                            item
                            xs={9}
                            onClick={() => navigate('/internship-intention')}>
                            <Typography
                              color='textSecondary'
                              gutterBottom
                              variant='overline'>
                              Nuevas intenciones
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Avatar
                              sx={{
                                backgroundColor: '#375C8C ',
                                height: 56,
                                width: 56
                              }}>
                              <ArchiveIcon />
                            </Avatar>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography color='textPrimary' variant='h4'>
                              <CountUp
                                end={pendingIntentionsCount}
                                duration={3}
                              />
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                pt: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                              <MdUpdate />
                              <Typography
                                color='textSecondary'
                                variant='caption'>
                                Actualizado recientemente
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xl={3} lg={3} sm={6} xs={12}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Grid container>
                          <Grid
                            item
                            xs={9}
                            onClick={() => navigate('/applications')}>
                            <Typography
                              color='textSecondary'
                              gutterBottom
                              variant='overline'>
                              Nuevos formularios
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Avatar
                              sx={{
                                backgroundColor: 'rgba(54, 162, 235, 1)',
                                height: 56,
                                width: 56
                              }}>
                              <ListAltIcon />
                            </Avatar>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography color='textPrimary' variant='h4'>
                              <CountUp end={pendingFormsCount} duration={3} />
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                pt: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                              <MdUpdate />
                              <Typography
                                color='textSecondary'
                                variant='caption'>
                                Actualizado recientemente
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xl={3} lg={3} sm={6} xs={12}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Grid container>
                          <Grid
                            item
                            xs={9}
                            onClick={() => navigate('/internship-assessment')}>
                            <Typography
                              color='textSecondary'
                              gutterBottom
                              variant='overline'>
                              Informes pendientes
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Avatar
                              sx={{
                                backgroundColor: 'rgba(75, 192, 192, 1)',
                                height: 56,
                                width: 56
                              }}>
                              <AssignmentIcon />
                            </Avatar>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography color='textPrimary' variant='h4'>
                              <CountUp end={sentReportsCount} duration={3} />
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                pt: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                              <MdUpdate />

                              <Typography
                                color='textSecondary'
                                variant='caption'>
                                Actualizado recientemente
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xl={3} lg={3} sm={6} xs={12}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Grid container>
                          <Grid item xs={9}>
                            <Typography
                              color='textSecondary'
                              gutterBottom
                              variant='overline'>
                              Prácticas en curso
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Avatar
                              sx={{
                                backgroundColor: 'info.main',
                                height: 56,
                                width: 56
                              }}>
                              <BusinessIcon />
                            </Avatar>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography color='textPrimary' variant='h4'>
                              <CountUp
                                end={ongoingInternshipsCount}
                                duration={3}
                              />
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                pt: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                              <MdUpdate />
                              <Typography
                                color='textSecondary'
                                variant='caption'>
                                Actualizado recientemente
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item lg={8} md={12} xl={9} xs={12}>
                    <Card>
                      <CardHeader title='Estado de los alumnos por carrera' />
                      <Divider />
                      <CardContent>
                        <Box
                          sx={{
                            height: 435,
                            position: 'relative'
                          }}>
                          <GroupedBarChart setExportable={setInternStatus} />
                        </Box>
                      </CardContent>
                      <Divider />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2
                        }}>
                        <ExcelExporter
                          filename='Estado de los Alumnos por Carrera'
                          data={internStatus}
                        />
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item lg={4} md={6} xl={3} xs={12}>
                    <Card>
                      <CardHeader title='Aprobados y rechazados por carrera' />
                      <Divider />
                      <CardContent>
                        <Box
                          sx={{
                            height: '100%',
                            position: 'relative'
                          }}>
                          {careerId === DEFAULT_CAREER && (
                            <CareerSelector
                              careerId={graphsCareerId}
                              setCareerId={setGraphsCareerId}
                            />
                          )}
                          <PieChart
                            graphsCareerId={graphsCareerId}
                            setExportable={setApplicationsStatus}
                          />
                        </Box>
                      </CardContent>
                      <Divider />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2,
                          height: '100%'
                        }}>
                        <ExcelExporter
                          filename='Aprobados y Rechazados por Carrera'
                          data={applicationsStatus}
                        />
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item lg={4} md={6} xl={4} xs={12}>
                    <Card>
                      <CardHeader title='Prácticas registradas en el extranjero' />
                      <Divider />
                      <CardContent>
                        <Box
                          sx={{
                            p: 2,
                            height: '100%'
                          }}>
                          <TableChart setExportable={setInternCountries} />
                        </Box>
                      </CardContent>
                      <Divider />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2,
                          height: '100%'
                        }}>
                        <ExcelExporter
                          filename='Practicas registradas en el extranjero'
                          data={internCountries}
                        />
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item lg={8} md={12} xl={8} xs={12}>
                    <Card>
                      <CardHeader title='Empresas más elegidas por los practicantes' />
                      <Divider />
                      <CardContent>
                        <Box
                          sx={{
                            height: 400,
                            position: 'relative'
                          }}>
                          <VerticalBar
                            setExportable={setTopCompaniesRegistered}
                          />
                        </Box>
                      </CardContent>
                      <Divider />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2
                        }}>
                        <ExcelExporter
                          filename='Empresas mas Elegidas por los Practicantes'
                          data={topCompaniesRegistered}
                        />
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          }
        />
        <Route exact path='/applications' element={<ApplicationsList />} />

        <Route exact path='/evaluations' element={<EvaluationsList />} />
        <Route exact path='/satisfaction-survey' element={<SurveyList />} />
        <Route path='/edit-form' element={<SelectEdit />} />
        <Route
          path='/applications/:applicationId'
          element={<ApplicationCheck />}
        />
        <Route
          path='/evaluations/:evaluationId'
          element={<EvaluationCheck />}
        />
        <Route
          path='/satisfaction-survey/:surveyId'
          element={<SurveyCheck />}
        />
        <Route path='/import' element={<ImportStudents />} />
        <Route path='/internship-intention' element={<InternshipIntention />} />
        <Route path='/insurance-list' element={<Insurance />} />

        <Route exact path='/internship-assessment' element={<ReportsList />} />
        <Route
          path='/internship-assessment/:studentId/:internshipId'
          element={<AssessReport />}
        />
        <Route path='/extension-list/' element={<ExtensionList />} />
        <Route path='/careers-settings' element={<CareersSettings />} />
        <Route
          path='/supervisor-management'
          element={<SupervisorManagement />}
        />
        <Route path='/employer-remarks/' element={<RemarkList />} />
        <Route
          exact
          path='/wip'
          element={
            <Grid container direction='column' alignItems='center' mar>
              <WarningIcon fontSize='large' />
              <Typography variant='h3'>Página en construcción</Typography>
              <Typography color='textSecondary'>
                Estamos trabajando para usted
              </Typography>
            </Grid>
          }
        />
        <Route path='/metrics' element={<Metrics />} />
        {userRole === ADMIN_ROLE && (
          <Route path='/control-panel/' element={<ControlPanel />} />
        )}
      </Routes>
    </div>
  );
}

export default DashboardAdmin;
