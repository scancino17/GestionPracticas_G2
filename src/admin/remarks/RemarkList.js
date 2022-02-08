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
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import React, { useEffect, useMemo, useState } from 'react';
import { useSupervisor } from '../../providers/Supervisor';
import { useUser, DEFAULT_CAREER, ADMIN_ROLE } from '../../providers/User';
import CareerSelector from '../../utils/CareerSelector';
import { toLegibleDate, toLegibleTime } from '../../utils/FormatUtils';

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
              {`Observación de Practica ${remark.internshipNumber} de ${remark.studentName}`}
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
    <Dialog fullWidth open={showAnswerModal} onClose={closeModal}>
      <DialogTitle>Enviar observación a supervisor de escuela</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Puede responder la observación respecto al estudiante{' '}
          <Box fontWeight='fontWeightBold' display='inline'>
            {remark.studentName}
          </Box>{' '}
          a su supervisor{' '}
          <Box fontWeight='fontWeightBold' display='inline'>
            {remark.employerName}
          </Box>{' '}
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
    </Dialog>
  );
}

function RemarkList() {
  const { userRole } = useUser();
  const { remarkList } = useSupervisor();
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const [expanded, setExpanded] = useState();
  const [selected, setSelected] = useState({ read: false, notRead: true });

  const changeExpanded = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  const filteredRemarkList = useMemo(() => {
    return remarkList
      .slice()
      .filter(
        (item) =>
          selectedCareerId === DEFAULT_CAREER ||
          item.careerId === selectedCareerId
      )
      .filter(
        (item) =>
          name === '' ||
          item.studentName.includes(name) ||
          item.employerName.includes(name)
      )
      .filter(
        (item) =>
          (item.read && selected.read) || (!item.read && selected.notRead)
      );
  }, [name, remarkList, selectedCareerId, selected]);

  function handleCheckboxes(e) {
    setSelected((prev) => {
      return { ...prev, [e.target.name]: e.target.checked };
    });
  }

  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Evaluate.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Observaciones de empleadores</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid
          container
          justifyContent='flex-end'
          alignItems='center'
          spacing={4}>
          <Grid item>
            <TextField
              label='Buscar por nombre'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <FormControl>
              <FormLabel>Estado</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selected.notRead}
                      onChange={handleCheckboxes}
                      name='notRead'
                    />
                  }
                  label='No Leído'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selected.read}
                      onChange={handleCheckboxes}
                      name='read'
                    />
                  }
                  label='Leído'
                />
              </FormGroup>
            </FormControl>
          </Grid>
          {userRole === ADMIN_ROLE && (
            <Grid item>
              <CareerSelector
                careerId={selectedCareerId}
                setCareerId={setSelectedCareerId}
              />
            </Grid>
          )}
        </Grid>
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        {filteredRemarkList.length > 0 ? (
          <Container style={{ marginTop: '2rem' }}>
            {filteredRemarkList.map((remark) => (
              <RemarkItem
                key={remark.index}
                remark={remark}
                expanded={expanded}
                changeExpanded={changeExpanded}
              />
            ))}
          </Container>
        ) : (
          <Grid
            container
            direction='column'
            align='center'
            justifyContent='center'
            style={{ marginTop: '6rem' }}>
            <Grid item>
              <img
                src='evaluate.png'
                width='300'
                alt='Sin observaciones disponibles'
              />
            </Grid>
            <Typography variant='h5' color='textSecondary'>
              No hay observaciones de empleadores disponibles
            </Typography>
          </Grid>
        )}
      </Container>
    </Grid>
  );
}

export default RemarkList;
