import React, { useState, useEffect } from 'react';
import { useUser } from '../providers/User';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Button,
  Divider,
  makeStyles
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

/**
 * Tipos de notificación para estudiantes. Por favor, mantener nombres similares
 * a los estados de internship definidos en InternshipStates.js
 * La idea es utilizarlos en todo el código, para estandarizar la definición
 * de tipos de Notificaciones en la aplicación
 */
export const StudentNotificationTypes = {
  approvedIntention: 'approvedIntention',
  deniedIntention: 'deniedIntention',
  approvedApplication: 'approvedApplication',
  changeDetailsApplication: 'changeDetailsApplication',
  deniedApplication: 'deniedApplication',
  authorizedInternship: 'authorizedInternship',
  reportNeedChanges: 'reportNeedChanges',
  finishedInternship: 'finishedInternship',
  approvedExtension: 'approvedExtension',
  deniedExtension: 'deniedExtension',
  insurance: 'insurance'
};

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
}));

const NotificationItem = ({ type, time, handleDiscard }) => {
  const classes = useStyles();

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
      case StudentNotificationTypes.insurance:
        return 'Seguro de práctica';
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
      case StudentNotificationTypes.insurance:
        return 'Se ha publicado tu seguro de práctica.';
      default:
        return 'Notificación';
    }
  };

  const formatDate = (date) => {
    const twoDigits = (number) => (number < 10 ? '0' + number : '' + number);
    return `${twoDigits(date.getHours())}:${twoDigits(
      date.getMinutes()
    )} ${twoDigits(date.getDate())}-${twoDigits(date.getMonth() + 1)}`;
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>
          {notificationTitle(type)}
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Typography className={classes.secondaryHeading}>
          {formatDate(time.toDate())}
        </Typography>
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
  const { userData, updateUser } = useUser();

  useEffect(() => {
    if (userData.notifications) setNotifications(userData.notifications);
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

    updateUser({ notifications: newNotifications });
  };

  return (
    <>
      <Typography style={{ margin: '1rem' }}>
        <Box fontWeight='bold'>Notificaciones</Box>
      </Typography>
      <Divider />

      {userData.notifications &&
        Object.entries(userData.notifications).length === 0 && (
          <Typography>
            <Box style={{ padding: '1rem' }}>
              Nada que ver por aquí. ¡Vuelve más tarde!
            </Box>
          </Typography>
        )}
      {notifications &&
        Object.keys(notifications)
          .sort(
            (f, s) =>
              notifications[f].time.toDate() - notifications[s].time.toDate()
          )
          .map((key, i) => (
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
