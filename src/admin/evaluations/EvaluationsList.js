import React, { useEffect, useMemo, useState } from 'react';
import {
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography
} from '@material-ui/core';
import { ADMIN_ROLE, DEFAULT_CAREER, useUser } from '../../providers/User';
import { useSupervisor } from '../../providers/Supervisor';
import CareerSelector from '../../utils/CareerSelector';
import { Pagination } from '@material-ui/lab';
import { NavigateNext } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';

function EvaluationItem({ evaluation }) {
  const navigate = useNavigate();

  return (
    <ListItem button onClick={() => navigate(`/evaluations/${evaluation.id}`)}>
      <ListItemText
        primary={evaluation.studentName}
        secondary={`${evaluation.studentRut} - ${evaluation.studentNumber} - Práctica ${evaluation.internshipNumber} - ${evaluation.careerId}`}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => navigate(`/evaluations/${evaluation.id}`)}>
          <NavigateNext />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function EvaluationsList() {
  const { userRole } = useUser();
  const { employerEvaluations } = useSupervisor();
  const [name, setName] = useState('');
  const [selectedCareerId, setSelectedCareerId] = useState(DEFAULT_CAREER);
  const [selected, setSelected] = useState({ read: false, notRead: true });
  const itemsPerPage = 8;
  const [page, setPage] = useState(1);

  function handleCheckboxes(e) {
    setSelected((prev) => {
      return { ...prev, [e.target.name]: e.target.checked };
    });
  }

  const filteredEvaluationList = useMemo(() => {
    return employerEvaluations
      .slice()
      .filter(
        (item) =>
          selectedCareerId === DEFAULT_CAREER ||
          item.careerId === selectedCareerId
      )
      .filter((item) => name === '' || item.studentName.includes(name))
      .filter(
        (item) =>
          (item.read && selected.read) || (!item.read && selected.notRead)
      );
  }, [employerEvaluations, selectedCareerId, name, selected]);

  useEffect(
    () => console.log(filteredEvaluationList),
    [filteredEvaluationList]
  );
  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Form.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Evaluación de supervisores</Typography>
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
        <List>
          {filteredEvaluationList
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((evaluation) => (
              <>
                <EvaluationItem evaluation={evaluation} />
                <Divider />
              </>
            ))}
        </List>
        <Grid container justifyContent='flex-end'>
          {filteredEvaluationList.length > 0 ? (
            <Pagination
              count={Math.ceil(filteredEvaluationList.length / itemsPerPage)}
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
                  src='post.png'
                  width='300'
                  alt='Sin evaluaciones de supervisores'
                />
              </Grid>
              <Typography variant='h5' color='textSecondary'>
                No hay evaluaciones de supervisores pendientes.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Grid>
  );
}

export default EvaluationsList;
