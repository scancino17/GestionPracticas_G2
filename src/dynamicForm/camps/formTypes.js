/**
 * Tipos de campos de la presentación
 */
export const FieldTypes = {
  formTextInput: 'Entrada de texto',
  formSelect: 'Menú de opciones',
  formFileInput: 'Seleccionar archivos',
  formHeader: 'Título',
  formSpace: 'Espacio en blanco',
  formSatisfaction: 'Medidor satisfacción',
  formCustom: 'Campos predefinidos'
};

/**
 * Tipos de campos para los campos predefinidos (obligatorios)
 */
export const CustomTypes = {
  formEmpresa: 'Empresa',
  formCountry: 'País',
  formCiudad: 'Ciudad',
  formStartDate: 'Fecha de inicio',
  formEndDate: 'Fecha de término'
};

/**
 * Tipos de formularios en el sistema.
 * Ojo: el value de cada key debe ser el nombre de la colección de
 * plantillas de formularios en la base de datos
 */
export const FormTypes = {
  SurveyForm: 'form-survey',
  EvaluationForm: 'form-evaluation',
  ApplicationForm: 'form'
};
