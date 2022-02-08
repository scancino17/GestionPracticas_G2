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
  List
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { NavigateNext } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { sentReport } from '../../InternshipStates';
import CareerSelector from '../../utils/CareerSelector';
import { ADMIN_ROLE, DEFAULT_CAREER, useUser } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';
import { Button } from '@mui/material';

function ReportsList() {
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const { userRole } = useUser();
  const { internships } = useSupervisor();

  const sentReportsList = useMemo(() => {
    if (internships)
      return internships.filter((item) => item.status === sentReport);
    else return [];
  }, [internships]);

  const filteredInternshipsList = useMemo(() => {
    let filtered = sentReportsList.slice();

    if (selectedCareerId !== 'general')
      filtered = filtered.filter((item) => item.careerId === selectedCareerId);
    if (name !== '')
      filtered = filtered.filter((item) => item.studentName.includes(name));
    return filtered;
  }, [sentReportsList, selectedCareerId, name]);

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
        <Typography variant='h4'>Evaluar informes de práctica</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid style={{ marginBlockEnd: '1rem' }} container spacing={4}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Buscar estudiante'
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
            <Button
              fullWidth
              color='primary'
              variant='contained'
              startIcon={<GetAppIcon />}>
              Exportar datos
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Container style={{ marginTop: '2rem' }}>
        {filteredInternshipsList.length > 0 ? (
          <List>
            {filteredInternshipsList.map((internship) => (
              <>
                <ReportItem internship={internship} />
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
                src='evaluate.png'
                width='300'
                alt='Sin informes de practica disponibles'
              />
            </Grid>
            <Typography variant='h5' color='textSecondary'>
              No hay informes de práctica disponibles
            </Typography>
          </Grid>
        )}
      </Container>
    </Grid>
  );
}

function ReportItem({ internship }) {
  const navigate = useNavigate();

  return (
    <ListItem
      button
      onClick={() =>
        navigate(
          `/internship-assessment/${internship.studentId}/${internship.id}`
        )
      }>
      <ListItemText
        primary={internship.studentName}
        secondary={`${internship.applicationData['Rut del estudiante']} - ${internship.applicationData['Número de matrícula']} - Práctica ${internship.internshipNumber} - ${internship.careerName}`}
      />
      <ListItemSecondaryAction>
        <IconButton
          onClick={() =>
            navigate(
              `/internship-assessment/${internship.studentId}/${internship.id}`
            )
          }>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ReportsList;
