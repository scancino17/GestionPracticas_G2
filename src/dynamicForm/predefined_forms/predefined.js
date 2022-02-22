import { FieldTypes } from '../camps/FormTypes';
/**
 * Formularios predefinidos
 */
export const predefinedSurvey = [
  {
    step: 'INFORMACIÓN GENERAL DEL ESTUDIANTE Y DE LA EMPRESA',
    uneditable: true,
    form: [
      {
        type: FieldTypes.formSatisfaction,
        name: 'Habilidades Comunicativas:',
        description:
          'Refiere a la capacidad de comunicar discursos en forma oral y escrita, basándose en los recursos lingüísticos académicos, para desempeñarse en situaciones del ámbito profesional.',
        value: null
      },
      {
        type: FieldTypes.formHeader,
        name: 'Estudiante: ',
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Nombre del estudiante',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Rut del estudiante',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Número de matrícula',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Correo del estudiante',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Telefono',
        value: '',

        uneditable: true
      },
      //===============================================
      {
        type: FieldTypes.formHeader,
        name: 'Institución: ',
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Nombre',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'RUT',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Giro',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Dirección',
        value: '',

        uneditable: true
      },
      //======================
      {
        type: FieldTypes.formHeader,
        name: 'Unidad Receptora: ',
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Área',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Dirección',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Supervisor',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Titulo (Supervisor)',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Cargo',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Teléfono',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Correo',
        value: '',

        uneditable: true
      }
    ]
  },
  {
    step: 'Evaluación de Competencias Generales',
    uneditable: true,
    form: [{}]
  },
  {
    step: 'Competencias disiplinares',
    uneditable: true,
    form: [{}]
  }
];

export const predefinedEvaluation = [
  {
    step: 'INFORMACIÓN GENERAL DEL ESTUDIANTE Y DE LA EMPRESA',
    uneditable: true,
    form: [
      {
        type: FieldTypes.formSatisfaction,
        name: 'Habilidades Comunicativas:',
        description:
          'Refiere a la capacidad de comunicar discursos en forma oral y escrita, basándose en los recursos lingüísticos académicos, para desempeñarse en situaciones del ámbito profesional.',
        value: null
      },
      {
        type: FieldTypes.formHeader,
        name: 'Estudiante: ',
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Nombre del estudiante',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Rut del estudiante',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Número de matrícula',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Correo del estudiante',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Telefono',
        value: '',

        uneditable: true
      },
      //===============================================
      {
        type: FieldTypes.formHeader,
        name: 'Institución: ',
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Nombre',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'RUT',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Giro',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Dirección',
        value: '',

        uneditable: true
      },
      //======================
      {
        type: FieldTypes.formHeader,
        name: 'Unidad Receptora: ',
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Área',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Dirección',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Supervisor',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Titulo (Supervisor)',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Cargo',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Teléfono',
        value: '',

        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Correo',
        value: '',

        uneditable: true
      }
    ]
  },
  {
    step: 'Evaluación de Competencias Generales',
    uneditable: true,
    form: [{}]
  },
  {
    step: 'Competencias disciplinares',
    uneditable: true,
    form: [{}]
  }
];

export const predefinedForm = [
  {
    step: 'Información del estudiante',
    uneditable: true,
    form: [
      {
        type: FieldTypes.formHeader,
        name: 'Información del estudiante',
        value: 'Información del estudiante',
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Nombre del estudiante',
        value: '',
        readOnly: true,
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Rut del estudiante',
        value: '',
        readOnly: true,
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Número de matrícula',
        value: '',
        readOnly: true,
        uneditable: true
      },
      {
        type: FieldTypes.formTextInput,
        name: 'Correo del estudiante',
        value: '',
        readOnly: true,
        uneditable: true
      }
    ]
  }
];
