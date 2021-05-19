import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        marginRight: '2rem',
        marginTop: '3rem'
    },
    media: {
        height: 250,
    },
});

function Stories() {
    const classes = useStyles();
    return (
        <Grid container style={{ marginLeft: '1rem'}}>
            <Grid item xs={12} sm={6} md={4}>
                <Card className={classes.root}>
                    <CardActionArea>
                        <CardMedia
                        className={classes.media}
                        image='story-1.png'
                        title='Faceless Characters'
                        />
                        <CardContent>
                        <Typography gutterBottom variant='h5' component='h2'>
                            ¡Redacta un gran informe!
                        </Typography>
                        <Typography variant='body2' color='textSecondary' component='p'>
                            Some quick example text to build on the card title and make up the bulk of the card's content.
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
                        <Typography gutterBottom variant='h5' component='h2'>
                            Prepara tu presentación
                        </Typography>
                        <Typography variant='body2' color='textSecondary' component='p'>
                            Some quick example text to build on the card title and make up the bulk of the card's content.
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
                        <Typography gutterBottom variant='h5' component='h2'>
                            En el ambiente de trabajo
                        </Typography>
                        <Typography variant='body2' color='textSecondary' component='p'>
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
            
    );
}

export default Stories;