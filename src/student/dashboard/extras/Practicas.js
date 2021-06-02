import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Hidden, Typography } from '@material-ui/core';
import { FaSuitcase } from 'react-icons/fa';
import StudentIntention from './StudentIntentionButton';

function Practicas({ practicas }) {
  return (
    <Grid direction='column' style={{ width: '100%' }}>
      {practicas.map((practica) => (
        <Practica practica={practica} />
      ))}
    </Grid>
    /*<List border={false} data={practicas}>
      {(practica) => <Practica practica={practica} />}
    </List>*/
  );
}

function Practica({ practica }) {
  let history = useHistory();

  /*practicaDisponible(practica) ? (
    <Box
      round='small'
      hoverIndicator={{
        elevation: 'medium'
      }}
      onClick={() => {}}>
      <Card pad='medium'>
        <CardHeader pad='xsmall'>{`Práctica ${practica.applicationNumber}`}</CardHeader>
        <CardBody direction='row' justify='between'>
          <Box>
            <Card pad='small' background={practicaColorStatus(practica.status)}>
              <CardBody>{practica.status}</CardBody>
            </Card>
          </Box>
          <Box pad='small'>
            <FormNext />
          </Box>
        </CardBody>
        <CardFooter>
          <Button
            label='Lista  de prácticas'
            onClick={() =>
              history.push(`/internship/${practica.studentId}/${practica.id}`)
            }
          />
          <StudentIntention practica={practica} />
        </CardFooter>
      </Card>
    </Box>
  ) : (
    <PracticaCard practica={practica} />
  );*/

  /*<Card pad='medium'>
      <CardHeader pad='xsmall'>{`Práctica ${practica.applicationNumber}`}</CardHeader>
      <CardBody direction='row' justify='between'>
        <Box>
          <Card pad='small' background={practicaColorStatus(practica.status)}>
            <CardBody>{practica.status}</CardBody>
          </Card>
        </Box>
        <Box pad='small'>
          <FormNext />
        </Box>
      </CardBody>
    </Card>*/

  return (
    <Grid
      container
      style={{ padding: '1rem' }}
      justify='space-between'
      wrap='nowrap'>
      <Grid
        container
        alignItems='center'
        direction='row'
        justify='space-between'
        wrap='nowrap'>
        <Grid item container>
          <Grid item>
            <Hidden smDown>
              <FaSuitcase
                className='item-responsive'
                style={{
                  color: 'inherit',
                  fontSize: '1rem',
                  marginRight: '1rem'
                }}
              />
            </Hidden>
          </Grid>
          <Grid item>
            <Typography variant='h6'>{`Práctica ${practica.applicationNumber}`}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <StudentIntention practica={practica} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Practicas;
