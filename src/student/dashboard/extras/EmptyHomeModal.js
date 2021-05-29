import React from 'react';
import Practicas from './Practicas';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function EmptyHomeModal({ open, onClose, practicas }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      aria-labelledby='Intenciones de práctica'
      aria-describedby='Declarar intención de práctica'>
      <DialogTitle>Declarar intención de práctica</DialogTitle>
      <DialogContent>
        <Practicas practicas={practicas} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EmptyHomeModal;
