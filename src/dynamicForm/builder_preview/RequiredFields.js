import { FieldTypes, FormTypes } from '../camps/FormTypes';

export const RequiredFields = {
  // Source aquí sería userData.
  [FormTypes.ApplicationForm]: {
    studentName: {
      propName: 'studentName',
      displayName: 'Nombre del estudiante',
      type: FieldTypes.formTextInput,
      data: (source) => source.name
    },
    studentRut: {
      propName: 'studentRut',
      displayName: 'Rut del estudiante',
      type: FieldTypes.formTextInput,
      data: (source) => source.rut
    },
    studentNumber: {
      propName: 'studentNumber',
      displayName: 'Número de matrícula',
      type: FieldTypes.formTextInput,
      data: (source) => source.enrollmentNumber
    },
    studentEmail: {
      propName: 'studentEmail',
      displayName: 'Correo del estudiante',
      type: FieldTypes.formTextInput,
      data: (source) => source.email
    },
    employerEmail: {
      propName: 'employerEmail',
      displayName: 'Correo del supervisor',
      type: FieldTypes.formTextInput
      // Sin data: debe ser ingresado por el usuario
    },
    employerName: {
      propName: 'employerName',
      displayName: 'Nombre del supervisor',
      type: FieldTypes.formTextInput
      // Sin data: debe ser ingresado por el usuario
    }
  },
  [FormTypes.EvaluationForm]: {},
  [FormTypes.SurveyForm]: {}
};
