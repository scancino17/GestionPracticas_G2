import React, { useState, useMemo } from 'react';
import {
  Grid,
  Container,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  List,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Slide,
  Button
} from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import { sentExtension } from '../../InternshipStates';
import CareerSelector from '../../utils/CareerSelector';
import { ADMIN_ROLE, DEFAULT_CAREER, useUser } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

function ExtensionList() {
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const { userRole } = useUser();
  const { internships } = useSupervisor();

  const sentExtensionList = useMemo(() => {
    if (internships)
      return internships.filter(
        (item) => item.extensionStatus === sentExtension
      );
    else return [];
  }, [internships]);

  const filteredInternships = useMemo(() => {
    let filtered = sentExtensionList.slice();
    if (selectedCareerId !== 'general')
      filtered = filtered.filter((item) => item.careerId === selectedCareerId);
    if (name !== '')
      filtered = filtered.filter((item) => item.studentName.includes(name));
    return filtered;
  }, [sentExtensionList, selectedCareerId, name]);

  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Extension.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Extensiones de prácticas</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid
          container
          justifyContent='flex-end'
          alignItems='center'
          spacing={4}>
          <Grid item>
            <TextField
              label='Buscar estudiante'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
        {filteredInternships.length > 0 ? (
          <List>
            {filteredInternships.map((internship) => (
              <>
                <IntershipItem key={internship.id} internship={internship} />
                <Divider />
              </>
            ))}
          </List>
        ) : (
          <Grid
            container
            direction='column'
            align='center'
            justifyContent='center'
            style={{ marginTop: '6rem' }}>
            <Grid item>
              <img
                src='health.png'
                width='300'
                alt='Sin extensiones de práctica'
              />
            </Grid>
            <Typography variant='h5' color='textSecondary'>
              No hay extensiones de práctica disponibles
            </Typography>
          </Grid>
        )}
      </Container>
    </Grid>
  );
}

function IntershipItem({ internship }) {
  const [showApproved, setShowApproved] = useState(false);
  const [showDenied, setShowDenied] = useState(false);
  const [showExtension, setShowExtension] = useState(false);
  const [reason, setReason] = useState('');
  const { rejectExtension, approveExtension } = useSupervisor();

  function TransformDate(date) {
    return (
      date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear()
    );
  }

  function handleExtensionDenied() {
    rejectExtension(internship, reason);
  }

  function handleExtensionApproved() {
    approveExtension(internship, reason);
  }

  return (
    <>
      <ListItem
        button
        onClick={() => {
          setShowExtension(true);
        }}>
        <ListItemText
          primary={internship.studentName}
          secondary={internship.applicationData.Empresa}
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={() => {
              setShowExtension(true);
            }}>
            <NavigateNext />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {internship && (
        <Dialog
          open={showExtension}
          onClose={() => setShowExtension(false)}
          TransitionComponent={Transition}
          fullWidth>
          <DialogTitle>Solicitud de extensión</DialogTitle>

          <DialogContent>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  variant='outlined'
                  label='Razón de la solicitud'
                  value={internship.reasonExtension}
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Fecha actual'
                  value={
                    internship.applicationData['Fecha de término']
                      ? TransformDate(
                          internship.applicationData[
                            'Fecha de término'
                          ].toDate()
                        )
                      : null
                  }
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Fecha propuesta'
                  value={
                    internship.dateExtension
                      ? TransformDate(internship.dateExtension.toDate())
                      : null
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => setShowDenied(true)}>
              Rechazar
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                setShowApproved(true);
              }}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        open={showApproved || showDenied}
        onClose={() => {
          setShowApproved(false);
          setShowDenied(false);
        }}
        TransitionComponent={Transition}
        fullWidth>
        <DialogTitle>
          {showApproved ? 'Aprobar' : 'Rechazar'} solicitud de extensión
        </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant='outlined'
            label='Observaciones'
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant='outlined'
            onClick={() => {
              setShowApproved(false);
              setShowDenied(false);
            }}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color={showApproved ? 'primary' : 'secondary'}
            onClick={() => {
              if (showApproved) handleExtensionApproved();
              else handleExtensionDenied();
              setShowApproved(false);
              setShowDenied(false);
              setShowExtension(false);
            }}>
            {showApproved ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ExtensionList;
