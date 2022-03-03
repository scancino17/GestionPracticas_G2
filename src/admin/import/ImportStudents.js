import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';
import { functions, storage } from '../../firebase';
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSupervisor } from '../../providers/Supervisor';
import { ref, getDownloadURL } from 'firebase/storage';

function ImportStudents() {
  const navigate = useNavigate();
  const [careersNames, setCareersNames] = useState({});
  const [list, setList] = useState([]);
  const [currentUsersEmails, setCurrentUsersEmails] = useState([]);
  const [exampleUrl, setExampleUrl] = useState();
  const { students, careers } = useSupervisor();

  useEffect(() => {
    const emails = [];
    students.forEach((user) => emails.push(user.email));
    setCurrentUsersEmails(emails);

    const careerNames = {};
    careers.forEach((career) => (careerNames[career.id] = career.name));
    setCareersNames(careerNames);
  }, [students, careers]);

  const reader = new FileReader();
  reader.onload = (e) => {
    const wb = XLSX.read(e.target.result, { type: 'binary' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const temp = [];
    data.forEach((row) => {
      if (
        row.length === 23 &&
        row[0] !== 'NBE_CARRERA' &&
        !currentUsersEmails.includes(row[5])
      ) {
        temp.push(row);
      }
    });
    setList(temp);

    if (temp.length === 0)
      Swal.fire(
        'No hay nuevos alumnos',
        'El archivo seleccionado no contiene nuevos alumnos para registrar',
        'info'
      );
  };

  function handleFileUpload(files) {
    if (files[0]) reader.readAsBinaryString(files[0]);
  }

  function handleExcelDate(row) {
    // Como odio excel, ni siquiera se usa la fecha de nacimiento
    try {
      if (typeof row === 'number') {
        return new Date((row - (25567 + 1)) * 86400 * 1000);
      } else if (typeof row === 'string') {
        return Date.parse(row);
      }
    } catch {
      return Date.now();
    }
  }

  function handleSubmit() {
    const importStudents = functions.httpsCallable('importStudents');
    list.forEach((row) => {
      importStudents({
        able: true,
        birthDate: handleExcelDate(row[8]),
        careerId: row[1].toString(),
        careerName: careersNames[row[1]],
        careerPlan: row[9],
        communeOrigin: row[16],
        email: row[5],
        enrollmentNumber: row[2],
        entryMean: row[11],
        entryYear: row[10],
        level: row[18],
        name: row[4],
        region: row[17],
        rut: row[3],
        sex: row[7],
        step: 0
      });
    });
    Swal.fire(
      'Datos enviados',
      'Los datos de los estudiantes han sido enviados para su creación',
      'success'
    ).then(() => navigate('/'));
  }

  useEffect(() => {
    // Para que este link de descarga funcione, aquí tiene que apuntar a la plantilla en storage de firebase
    const exampleRef = ref(storage, 'Formato_ingreso_info_estudiantes.xlsx');
    getDownloadURL(exampleRef).then((res) => setExampleUrl(res));
  }, []);

  return (
    <Grid container direction='column'>
      <div
        style={{
          backgroundImage: "url('AdminBanner-Import.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '2rem'
        }}>
        <Typography variant='h4'>Importar estudiantes</Typography>
      </div>
      <Container style={{ marginTop: '2rem' }}>
        <Grid container direction='column' spacing={2}>
          {list.length === 0 && (
            <>
              <Grid item>
                <Card style={{ margin: '1rem 0 1rem 0' }}>
                  <CardHeader title='Plantilla de ejemplo'></CardHeader>
                  <CardContent>
                    <Typography>
                      Para importar estudiantes, se recomienda que utilice la
                      plantilla entregada a continuación. Esta plantilla trae
                      estudiantes de ejemplo: asegúrese de eliminarlos antes de
                      subir la plantilla con los estudiantes a importar.
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'end' }}>
                    <Button
                      variant='text'
                      color='primary'
                      component='a'
                      href={exampleUrl}
                      target='_blank'
                      rel='noopener'>
                      Descargar plantilla
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item>
                <Typography variant='h6'>
                  Seleccione el archivo con la información de los estudiantes:
                </Typography>
              </Grid>
              <Grid item>
                <DropzoneArea
                  showFileNames
                  filesLimit={1}
                  acceptedFiles={[
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  ]}
                  onChange={handleFileUpload}
                />
              </Grid>
            </>
          )}
          {list.length !== 0 && (
            <>
              <Grid item>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre alumno</TableCell>
                        <TableCell>Carrera</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((row) => {
                        return (
                          <TableRow key={row[2]}>
                            <TableCell>{row[4]}</TableCell>
                            <TableCell>{row[0]}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item container justifyContent='flex-end'>
                <Grid item>
                  <Button
                    onClick={handleSubmit}
                    color='primary'
                    variant='contained'>
                    Confirmar
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Grid>
  );
}

export default ImportStudents;
