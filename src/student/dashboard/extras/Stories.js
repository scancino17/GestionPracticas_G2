import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  media: {
    height: 250
  }
});

function Stories() {
  const classes = useStyles();
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={4}>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image='story-1.png'
              title='Faceless Characters'
            />
            <CardContent>
              <Typography gutterBottom variant='h5'>
                ¡Redacta un gran informe!
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image='story-2.png'
              title='Faceless Characters'
            />
            <CardContent>
              <Typography gutterBottom variant='h5'>
                Prepara tu presentación
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image='story-3.png'
              title='Faceless Characters'
            />
            <CardContent>
              <Typography gutterBottom variant='h5'>
                En el ambiente de trabajo
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Stories;
