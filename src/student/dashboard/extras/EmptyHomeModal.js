import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import React from 'react';
import Practicas from './Practicas';

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
