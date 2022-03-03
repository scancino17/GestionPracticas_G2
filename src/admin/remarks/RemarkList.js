import {
  makeStyles,
  withStyles,
  Grid,
  Typography,
  Container,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Hidden,
  Button,
  Box as TextBox,
  Divider
} from '@material-ui/core';
import { ExpandMore, GetApp } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { grey } from '@material-ui/core/colors';
import React, { useEffect, useMemo, useState } from 'react';
import { useSupervisor } from '../../providers/Supervisor';
import { useUser, DEFAULT_CAREER, ADMIN_ROLE } from '../../providers/User';
import CareerSelector from '../../utils/CareerSelector';
import {
  normalizeString,
  toLegibleDate,
  toLegibleDateTime,
  toLegibleTime
} from '../../utils/FormatUtils';
import { Box, DialogContentText, Tab, Tabs } from '@mui/material';

import ExcelFile from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/components/ExcelFile';
import ExcelSheet from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelSheet';
import ExcelColumn from 'react-export-excel-xlsx-fix/dist/ExcelPlugin/elements/ExcelColumn';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(4)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};
const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    [theme.breakpoints.up('sm')]: { flexBasis: '33.33%', flexShrink: 0 },
    [theme.breakpoints.down('sm')]: { flexBasis: '50%', flexShrink: 0 }
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    [theme.breakpoints.up('sm')]: { flexBasis: '66.66%', flexShrink: 0 },
    [theme.breakpoints.down('sm')]: { flexBasis: '50%', flexShrink: 0 }
  },
  bold: {
    fontWeight: 600
  },
  evaluatingSupervisorText: {
    color: theme.palette.text.secondary,
    fontWeight: 'medium'
  }
}));

const SecondaryButton = withStyles((theme) => ({
  root: {
    color: grey[700]
  }
}))(Button);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Grid
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </Grid>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function RemarkItem({ remark, expanded, changeExpanded }) {
  const classes = useStyles();
  const { updateRemark } = useSupervisor();
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  function closeModal() {
    setShowAnswerModal(false);
  }

  function handleMarkAsRead(event) {
    event.preventDefault();
    updateRemark(remark, { read: true });
  }

  return (
    <>
      <Accordion
        expanded={expanded === remark.index}
        onChange={changeExpanded(remark.index)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>
            {remark.employerName}
          </Typography>
          <Hidden xsDown>
            <Typography className={classes.secondaryHeading}>
              {`Observación de Practica ${remark.internshipNumber} de ${remark.studentName} -`}
              <Typography
                sx={{ display: 'inline' }}
                component='span'
                color='primary'>
                <strong>{` ${
                  remark.read ? ' Revisada el ' : ' Enviada el '
                }${toLegibleDate(
                  remark.read ? remark.updateTime : remark.remarkTime
                )}`}</strong>
              </Typography>
            </Typography>
          </Hidden>
          <Hidden smUp>
            <Typography className={classes.secondaryHeading}>
              {`${remark.studentName}`}
            </Typography>
          </Hidden>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} style={{ paddingBottom: '.5rem' }}>
              <Typography variant='h6'>Detalles de practicante</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>
                Nombre estudiante:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{remark.studentName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>Carrera:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{remark.careerName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography className={classes.bold}>
                Nombre supervisor:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{remark.employerName}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography className={classes.bold}>
                Correo de supervisor:
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>{remark.employerEmail}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography className={classes.bold}>Fecha:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>{`${toLegibleDate(remark.remarkTime)} ${toLegibleTime(
                remark.remarkTime
              )}`}</Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '1rem' }}>
              <Typography className={classes.bold}>Observación:</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>{remark.remark}</Typography>
            </Grid>
            {!!remark.answer && (
              <>
                <Grid item xs={12} style={{ paddingTop: '1rem' }}>
                  <Typography className={classes.bold}>Respuesta:</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{remark.answer}</Typography>
                </Grid>
              </>
            )}
            {!!remark.evaluatingSupervisor && (
              <Grid
                item
                container
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                style={{ paddingTop: '1rem' }}>
                <Typography className={classes.evaluatingSupervisorText}>
                  Evaluado por {remark.evaluatingSupervisor.name}
                </Typography>
                <Typography className={classes.evaluatingSupervisorText}>
                  {remark.evaluatingSupervisor.email}
                </Typography>
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
        {(!remark.read || !remark.answer) && (
          <AccordionActions>
            {!remark.read && (
              <Button color='primary' onClick={handleMarkAsRead}>
                Marcar como leído
              </Button>
            )}
            {!remark.answer && (
              <Button color='primary' onClick={() => setShowAnswerModal(true)}>
                Responder observación
              </Button>
            )}
          </AccordionActions>
        )}
      </Accordion>
      <AnswerModal
        remark={remark}
        closeModal={closeModal}
        showAnswerModal={showAnswerModal}
      />
    </>
  );
}

function AnswerModal({ remark, closeModal, showAnswerModal }) {
  const [answer, setAnswer] = useState('');
  const { updateRemark } = useSupervisor();

  function handleSubmit() {
    updateRemark(remark, { read: true, answer: answer });
    setAnswer('');
    closeModal();
  }

  function handleAnswerChange(event) {
    event.preventDefault();
    setAnswer(event.target.value);
  }

  useEffect(() => remark.answer && setAnswer(remark.answer), [remark]);

  return (
    <BootstrapDialog
      fullWidth
      onClose={closeModal}
      aria-labelledby='customized-dialog-title'
      open={showAnswerModal}>
      <BootstrapDialogTitle id='customized-dialog-title' onClose={closeModal}>
        Responder observación de supervisor
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Puede responder la observación respecto al estudiante{' '}
          <TextBox fontWeight='fontWeightBold' display='inline'>
            {remark.studentName}
          </TextBox>{' '}
          a su supervisor{' '}
          <TextBox fontWeight='fontWeightBold' display='inline'>
            {remark.employerName}
          </TextBox>{' '}
          a través de este medio.
        </DialogContentText>
        <TextField
          multiline
          minRows={4}
          label='Observaciones'
          variant='outlined'
          onChange={handleAnswerChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={closeModal}>Cerrar</SecondaryButton>
        <Button color='primary' onClick={handleSubmit}>
          Responder observación
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

function RemarkList() {
  const { userRole } = useUser();
  const { remarkList } = useSupervisor();
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const [expanded, setExpanded] = useState();
  const [selected, setSelected] = useState({ read: false, notRead: true });
  const { read, notRead } = selected;
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(1);
  const [indice, setIndice] = useState(0);
  const itemsPerPage = 14;
  const [startDate, setStartDate] = useState(
    new Date() - 1000 * 60 * 60 * 24 * 30 * 2
  );
  const [endDate, setEndDate] = useState(new Date());

  const changeExpanded = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  const filteredRemarkList = useMemo(() => {
    if (remarkList) {
      let filtered = remarkList.slice();
      filtered = filtered.filter(
        (item) =>
          selectedCareerId === DEFAULT_CAREER ||
          item.careerId === selectedCareerId
      );
      if (name !== '') {
        filtered = filtered.filter(
          (item) =>
            normalizeString(item.studentName).includes(normalizeString(name)) ||
            normalizeString(item.employerName).includes(normalizeString(name))
        );
      }
      if (read && notRead) {
        filtered = filtered.filter(
          (item) =>
            (!item.read &&
              item.remarkTime &&
              item.remarkTime.seconds * 1000 <= endDate &&
              item.remarkTime.seconds * 1000 >= startDate) ||
            (item.read &&
              item.updateTime &&
              item.updateTime.seconds * 1000 <= endDate &&
              item.updateTime.seconds * 1000 >= startDate)
        );
      } else if (read) {
        filtered = filtered.filter(
          (item) =>
            item.read &&
            item.updateTime &&
            item.updateTime.seconds * 1000 <= endDate &&
            item.updateTime.seconds * 1000 >= startDate
        );
      } else if (notRead) {
        filtered = filtered.filter(
          (item) =>
            !item.read &&
            item.remarkTime &&
            item.remarkTime.seconds * 1000 <= endDate &&
            item.remarkTime.seconds * 1000 >= startDate
        );
      }
      filtered.sort((a, b) =>
        (!a.read && a.remarkTime
          ? a.remarkTime
          : a.read && a.updateTime
          ? a.updateTime
          : null) <
        (!b.read && b.remarkTime
          ? b.remarkTime
          : b.read && b.updateTime
          ? b.updateTime
          : null)
          ? 1
          : (!a.read && a.remarkTime
              ? a.remarkTime
              : a.read && a.updateTime
              ? a.updateTime
              : null) ===
            (!b.read && b.remarkTime
              ? b.remarkTime
              : b.read && b.updateTime
              ? b.updateTime
              : null)
          ? a.size < b.size
            ? 1
            : -1
          : -1
      );
      return filtered;
    } else return [];
  }, [remarkList, name, read, notRead, selectedCareerId, endDate, startDate]);

  function handleChangeTab(event, newValue) {
    event.preventDefault();
    setSelectedTab(newValue);
  }

  function ExportarExcel() {
    const estados = ['Leídos', 'No leídos', 'Todos'];

    return (
      <ExcelFile
        element={
          <Button
            fullWidth
            color='primary'
            variant='contained'
            startIcon={<GetApp />}>
            Exportar datos
          </Button>
        }
        filename={`Observaciones de supervisores - ${estados[indice]}`}>
        <ExcelSheet
          data={filteredRemarkList}
          name='Observaciones de supervisores'>
          <ExcelColumn label='Nombre estudiante' value='studentName' />
          <ExcelColumn label='Carrera' value='careerName' />
          <ExcelColumn label='Tipo de práctica' value='internshipNumber' />
          <ExcelColumn label='Nombre del supervisor' value='employerName' />
          <ExcelColumn label='Correo del supervisor' value='employerEmail' />
          <ExcelColumn
            label='Fecha de envío'
            value={(col) => toLegibleDateTime(col.remarkTime)}
          />
          <ExcelColumn
            label='Estado'
            value={(col) => (col.read ? 'Leído' : 'No leído')}
          />
          <ExcelColumn label='Observación' value='remark' />
          <ExcelColumn
            label='Nombre encargado'
            value={(col) =>
              col.evaluatingSupervisor
                ? col.evaluatingSupervisor.name
                : 'Sin evaluar'
            }
          />
          <ExcelColumn
            label='Correo encargado'
            value={(col) =>
              col.evaluatingSupervisor
                ? col.evaluatingSupervisor.email
                : 'Sin evaluar'
            }
          />
          <ExcelColumn
            label='Fecha de respuesta'
            value={(col) =>
              col.updateTime
                ? toLegibleDateTime(col.updateTime)
                : 'Sin respuesta'
            }
          />
          <ExcelColumn
            label='Respuesta encargado'
            value={(col) => (col.answer ? col.answer : 'Sin respuesta')}
          />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  return (
    <Grid container direction='column'>
      <Grid
        style={{
          backgroundImage: "url('AdminBanner-Evaluate.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography component={'span'} variant='h4'>
          Observaciones de empleadores
        </Typography>
      </Grid>
      <Container style={{ marginTop: '2rem' }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              variant='scrollable'
              scrollButtons
              allowScrollButtonsMobile
              value={selectedTab}
              onChange={handleChangeTab}
              aria-label='Selección de observaciones a mostrar'>
              <Tab
                label='No leído'
                {...a11yProps(0)}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected({ read: false, notRead: true });
                  setIndice(0);
                  setPage(1);
                }}
              />
              <Tab
                label='Leído'
                {...a11yProps(1)}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected({ read: true, notRead: false });
                  setIndice(1);
                  setPage(1);
                }}
              />
              <Tab
                label='Todas'
                {...a11yProps(2)}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected({ read: true, notRead: true });
                  setIndice(2);
                  setPage(1);
                }}
              />
            </Tabs>
          </Box>
          <TabPanel value={selectedTab} index={indice}>
            <Grid style={{ marginBlockEnd: '1rem' }} container spacing={4}>
              <Grid item xs={12} sm={userRole === ADMIN_ROLE ? 4 : 8}>
                <TextField
                  fullWidth
                  label='Buscar por nombre'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              {userRole === ADMIN_ROLE && (
                <Grid item xs={12} sm={4}>
                  <CareerSelector
                    careerId={selectedCareerId}
                    setCareerId={setSelectedCareerId}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <ExportarExcel />
              </Grid>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container item xs={12} direction='row' spacing={2}>
                  <Grid item xs={12} md={2}>
                    <DatePicker
                      fullWidth
                      disableToolbar
                      variant='inline'
                      format='dd/MM/yyyy'
                      label={'Fecha inicio'}
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <DatePicker
                      fullWidth
                      disableToolbar
                      variant='inline'
                      format='dd/MM/yyyy'
                      label={'Fecha Fin'}
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                    />
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
              <Divider />
              <Container style={{ marginTop: '2rem' }}>
                {filteredRemarkList.length > 0 && (
                  <Container style={{ marginTop: '2rem' }}>
                    {filteredRemarkList
                      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                      .map((remark) => (
                        <RemarkItem
                          key={remark.index}
                          remark={remark}
                          expanded={expanded}
                          changeExpanded={changeExpanded}
                        />
                      ))}
                  </Container>
                )}
              </Container>

              <Grid
                container
                justifyContent='flex-end'
                style={{ marginTop: '2rem' }}>
                {filteredRemarkList.length > 0 ? (
                  <Pagination
                    count={Math.ceil(filteredRemarkList.length / itemsPerPage)}
                    page={page}
                    color='primary'
                    style={{ marginBottom: '40px' }}
                    onChange={(_, val) => setPage(val)}
                  />
                ) : (
                  <Grid
                    container
                    direction='column'
                    align='center'
                    justifyContent='center'
                    style={{ marginTop: '6rem' }}>
                    <Grid item>
                      <img
                        src='/evaluate.png'
                        width='300'
                        alt='Sin observaciones disponibles'
                      />
                    </Grid>
                    <Typography variant='h5' color='textSecondary'>
                      No hay observaciones de empleadores disponibles
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Container>
    </Grid>
  );
}

export default RemarkList;
