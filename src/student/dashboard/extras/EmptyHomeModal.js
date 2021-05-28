import React from 'react';
import Practicas from './Practicas';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function EmptyHomeModal(props) {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
  });

  return (
    <Dialog
      open={props.show}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.close}
      aria-labelledby='dialog-slide-title'
      aria-describedby='dialog-slide-description'>
      <DialogTitle>Declarar Práctica</DialogTitle>
      <DialogContent>
        {/*<Practicas practicas={props.practicas} />*/}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close} color='primary'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmptyHomeModal;
