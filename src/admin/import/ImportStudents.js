import React, { useState } from 'react';
import XLSX from 'xlsx';
import { auth, db, functions } from '../../firebase';
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
  Grid
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';

function ImportStudents() {
  const [list, setList] = useState([]);

  const reader = new FileReader();
  reader.onload = (e) => {
    const wb = XLSX.read(e.target.result, { type: 'binary' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const currentUsersEmails = [];
    db.collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((user) =>
          currentUsersEmails.push(user.data().email)
        );
      });

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
  };

  function handleFileUpload(files) {
    if (files[0]) reader.readAsBinaryString(files[0]);
  }

  function handleSubmit() {
    console.log(list);
    const importStudents = functions.httpsCallable('importStudents');
    list.forEach((row) => {
      importStudents({
        able: true,
        birthDate: Date.parse(row[8]),
        careerId: row[1],
        careerPlan: row[9],
        communeOrigin: row[16],
        email: row[5],
        enrollmentNumber: row[2],
        entryMean: row[11],
        entryYear: row[10],
        level: row[18],
        name: row[4],
        password: 'testtest',
        region: row[17],
        rut: row[3],
        sex: row[7],
        step: 0
      }).then((result) => console.log(result));
    });
  }

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
        <DropzoneArea
          filesLimit={1}
          showFileNames
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          onChange={handleFileUpload}
        />
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
                    <TableCell scope='row'>{row[4]}</TableCell>
                    <TableCell scope='row'>{row[0]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={handleSubmit} variant='contained'>
          Confirmar
        </Button>
        <Button
          onClick={() => {
            const actionCodeSettings = {
              url: 'http://localhost:3000',
              handleCodeInApp: true
            };
            auth.sendSignInLinkToEmail(
              'tgnpyuxkjugxuwznoh@twzhhq.online',
              actionCodeSettings
            );
          }}>
          Enviar email
        </Button>
      </Container>
    </Grid>
  );
}

export default ImportStudents;
