/**
 * Distintos estados que una internship pude tomar. Estos representan distintos
 * puntos en los que se puede encontrar una práctica. La idea de este archivo es
 * importar los string desde este archivo para facilitar la mantención de los
 * valores de los estados. Los pasos están ordenados más o menos de forma cronológica.
 */

/**
 * Los siguientes pasos representan los pasos disponibles durante el proceso de
 * declaración de práctica.
 */
export const availableInternship = 'Práctica disponible';
export const pendingIntention = 'Intención enviada';
export const approvedIntention = 'Intención aprobada';
export const deniedIntention = 'Intención rechazada';

/**
 * Una vez aprobada la intención de práctica, se pasa al proceso de inscripción de
 * la práctica.
 */
export const pendingApplication = 'Inscripción pendiente';
export const sentApplication = 'Inscripción enviada';
export const approvedApplication = 'Inscripción aprobada';
export const changeDetailsApplication = 'Necesita cambios';
export const deniedApplication = 'Inscripción rechazada';

/**
 * Una vez que se entrega el seguro, se procede al proceso de realizar la práctica.
 */
export const authorizedInternship = 'Práctica autorizada';
export const onGoingIntenship = 'Práctica en curso';
export const sentReport = 'Informe enviado';
export const reportNeedsChanges = 'Informe necesita cambios';
export const evaluatedInternship = 'Práctica evaluada';
export const finishedInternship = 'Práctica finalizada';

/**
 * La práctica puede ser extendida: estos son los estados utilizados en ese caso.
 */
export const sentExtension = 'Solicitud enviada';
export const approvedExtension = 'Extensión aprobada';
export const deniedExtension = 'Extensión rechazada';

/**
 * Funciones para ayudar a determinar el estado
 */
export const isAvailableInternship = (status) => status === availableInternship;
export const isPendingIntention = (status) => status === pendingIntention;
export const isApprovedIntention = (status) => status === approvedIntention;
export const isDeniedIntention = (status) => status === deniedIntention;

const checkOrItemEqualsStates = (status, states) => {
  let value = null;
  states.forEach((state) => {
    if (value === null) value = status === state;
    value = value || status === state;
  });

  return value;
};

export const finishedIntentionProcess = (status) =>
  checkOrItemEqualsStates(status, [
    availableInternship,
    pendingIntention,
    approvedIntention,
    deniedIntention,
    finishedInternship
  ]);
