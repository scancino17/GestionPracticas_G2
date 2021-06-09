import React, { useState, useEffect } from 'react';
import useAuth from '../providers/Auth';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Button,
  Divider
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { db } from '../firebase';

/**
 * Tipos de notificación para estudiantes. Por favor, mantener nombres similares
 * a los estados de internship definidos en InternshipStates.js
 * La idea es utilizarlos en todo el código, para estandarizar la definición
 * de tipos de Notificaciones en la aplicación
 */
export const StudentNotificationTypes = Object.freeze({
  approvedIntention: 'approvedIntention',
  deniedIntention: 'deniedIntention',
  approvedApplication: 'approvedApplication',
  changeDetailsApplication: 'changeDetailsApplication',
  deniedApplication: 'deniedApplication',
  authorizedInternship: 'authorizedInternship',
  reportNeedChanges: 'reportNeedChanges',
  finishedInternship: 'finishedInternship',
  approvedExtension: 'approvedExtension',
  deniedExtension: 'deniedExtension'
});

const NotificationItem = ({ type, time, handleDiscard }) => {
  const notificationTitle = (type) => {
    switch (type) {
      case StudentNotificationTypes.approvedIntention:
        return 'Intención aprobada';
      case StudentNotificationTypes.deniedIntention:
        return 'Intención rechazada';
      case StudentNotificationTypes.approvedApplication:
        return 'Inscripción aprobada';
      case StudentNotificationTypes.changeDetailsApplication:
        return 'Inscripción necesita cambios';
      case StudentNotificationTypes.deniedApplication:
        return 'Inscripción rechazada';
      case StudentNotificationTypes.authorizedInternship:
        return 'Práctica autorizada';
      case StudentNotificationTypes.reportNeedChanges:
        return 'Informe necesita cambios';
      case StudentNotificationTypes.finishedInternship:
        return 'Práctica finalizada';
      case StudentNotificationTypes.approvedExtension:
        return 'Extensión aprovada';
      case StudentNotificationTypes.deniedExtension:
        return 'Extensión rechazado';
      default:
        return 'Notificación';
    }
  };

  const notificationBody = (type) => {
    switch (type) {
      case StudentNotificationTypes.approvedIntention:
        return 'Tu intención de práctica ha sido aprobada.';
      case StudentNotificationTypes.deniedIntention:
        return 'Tu intención de práctica ha sido rechazada.';
      case StudentNotificationTypes.approvedApplication:
        return 'Tu inscripción de práctica ha sido aprobada.';
      case StudentNotificationTypes.changeDetailsApplication:
        return 'Se han solicitado cambios a la práctica que has inscrito';
      case StudentNotificationTypes.deniedApplication:
        return 'Tu inscripción de práctica ha sido rechazada';
      case StudentNotificationTypes.authorizedInternship:
        return 'Estás autorizado para comenzar la realización de práctica.';
      case StudentNotificationTypes.reportNeedChanges:
        return 'Se han solicitado cambios al informe entregado.';
      case StudentNotificationTypes.finishedInternship:
        return '¡Felicitaciones! Has finalizado el proceso de práctica.';
      case StudentNotificationTypes.approvedExtension:
        return 'Tu solicitud de extensión de práctica ha sido aprobada.';
      case StudentNotificationTypes.deniedExtension:
        return 'Tu solicitud de extensión de práctica ha sido rechazada.';
      default:
        return 'Notificación';
    }
  };

  const formatDate = (date) => {
    const twoDigits = (number) => (number < 10 ? '0' + number : '' + number);
    return `${twoDigits(date.getHours())}:${twoDigits(
      date.getMinutes()
    )} ${twoDigits(date.getDate() + 1)}-${twoDigits(date.getMonth() + 1)}`;
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{notificationTitle(type)}</Typography>
        <div style={{ flexGrow: 1 }} />
        <Typography>{formatDate(time.toDate())}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{notificationBody(type)}</Typography>
      </AccordionDetails>
      <AccordionActions>
        <div style={{ flexGrow: 1 }} />
        <Button variant='text' color='primary' onClick={handleDiscard}>
          Descartar
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

function NotificationMenu() {
  const [notifications, setNotifications] = useState([]);
  const { user, userData } = useAuth();

  useEffect(() => {
    if (userData.notifications) {
      setNotifications(userData.notifications);
    } else {
      console.log("Not to worry, we're still flying half a ship.");
    }
  }, [userData]);

  const discardNotification = (id) => {
    let newNotifications = {};
    Object.keys(notifications).forEach((key, i) => {
      if (notifications[key].id !== id)
        newNotifications = {
          ...newNotifications,
          [`${notifications[key].id}`]: notifications[key]
        };
    });

    db.collection('users')
      .doc(user.uid)
      .update({ notifications: newNotifications });
  };

  return (
    <>
      <Typography style={{ margin: '1rem' }}>
        <Box fontWeight='bold'>Notificaciones</Box>
      </Typography>
      <Divider />
      {notifications.length === 0 && (
        <Typography>
          <Box style={{ padding: '1rem' }}>
            Nada que ver por aquí. ¡Vuelve más tarde!
          </Box>
        </Typography>
      )}
      {Object.keys(notifications).map((key, i) => (
        <NotificationItem
          type={notifications[key].type}
          time={notifications[key].time}
          handleDiscard={() => discardNotification(notifications[key].id)}
        />
      ))}
    </>
  );
}

export default NotificationMenu;
