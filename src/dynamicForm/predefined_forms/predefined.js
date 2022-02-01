import { formTypes } from '../camps/formTypes';
/**
 * Formulñarios predefinidos
 */
 export const predefinedSurvey = [
    {
          step: 'INFORMACIÓN GENERAL DEL ESTUDIANTE Y DE LA EMPRESA',
          uneditable:true,
          form: [
            {
                type: formTypes.formSatisfaction,
                name: 'Habilidades Comunicativas:',
                description:'Refiere a la capacidad de comunicar discursos en forma oral y escrita, basándose en los recursos lingüísticos académicos, para desempeñarse en situaciones del ámbito profesional.',
                value: null
              },
              {
              type: formTypes.formHeader,
              name: 'Estudiante: ',
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Nombre del estudiante',
              value: '',
              readOnly: true,
              uneditable:true

            },
            {
              type: formTypes.formTextInput,
              name: 'Rut del estudiante',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Número de matrícula',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Correo del estudiante',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Telefono',
              value: '',
              readOnly: true,
              uneditable:true
            },
            //===============================================
            {
              type: formTypes.formHeader,
              name: 'Institución: ',
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Nombre',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'RUT',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Giro',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Dirección',
              value: '',
              readOnly: true,
              uneditable:true
            },
            //======================
            {
              type: formTypes.formHeader,
              name: 'Unidad Receptora: ',
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Área',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Dirección',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Supervisor',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Titulo (Supervisor)',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Cargo',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Teléfono',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Correo',
              value: '',
              readOnly: true,
              uneditable:true
            }

          ]}, 
          {
            step: 'Evaluación de Competencias Generales',
            uneditable:true,
            form: [
              {
               
              }]
          },
          {
            step: 'Competencias disiplinares',
            uneditable:true,
              form: [
                {
                   
                }
              ]
          }
        ]

  export const predefinedForm = 
    [
        {
          step: 'Información del estudiante',
          uneditable:true,
          form: [
            {
              type: formTypes.formHeader,
              name: 'Información del estudiante',
              value: 'Información del estudiante',
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Nombre del estudiante',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Rut del estudiante',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Número de matrícula',
              value: '',
              readOnly: true,
              uneditable:true
            },
            {
              type: formTypes.formTextInput,
              name: 'Correo del estudiante',
              value: '',
              readOnly: true,
              uneditable:true
            }
          ]
        }
      ]
;