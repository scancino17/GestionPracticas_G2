import { Heading, Text, Main, Box } from 'grommet';
import React from 'react';
import QuickAccess from '../dashboad-admin/QuickAccess';
import { List, Group, Task, Upload, DocumentText } from 'grommet-icons';

function DashboardAdmin() {
  return (
    <Main pad='xlarge'>
      <Heading>¡Hola, Usuario Admin!</Heading>
      <Box alignSelf='center' direction='row-responsive'>
        <Box pad='small'>
          <QuickAccess
            title='Solicitudes Pendientes'
            body={<Text weight='bold'>10</Text>}
          />
        </Box>
        <Box pad='small'>
          <QuickAccess
            title='Inscripciones Aprobadas'
            body={<List color='plain' />}
          />
        </Box>
        <Box pad='small'>
          <QuickAccess
            title='Administrar Encargados'
            body={<Group color='plain' />}
          />
        </Box>
      </Box>
      <Box alignSelf='center' direction='row-responsive'>
        <Box pad='small'>
          <QuickAccess
            title='Evaluar Prácticas'
            body={<Task color='plain' />}
          />
        </Box>
        <Box pad='small'>
          <QuickAccess
            title='Importar Alumnos'
            body={<Upload color='plain' />}
          />
        </Box>
        <Box pad='small'>
          <QuickAccess
            title='Editar Formulario'
            body={<DocumentText color='plain' />}
          />
        </Box>
      </Box>
    </Main>
  );
}

export default DashboardAdmin;
