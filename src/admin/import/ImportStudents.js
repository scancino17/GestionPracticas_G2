import React, { useState } from 'react';
import {
  Box,
  Button,
  FileInput,
  Heading,
  List,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from 'grommet';
import XLSX from 'xlsx';
import { auth, db } from '../../firebase';
import axios from 'axios';

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

  function handleFileUpload(e) {
    if (e.target.files[0]) reader.readAsBinaryString(e.target.files[0]);
  }

  function handleSubmit() {
    /*list.forEach((row) => {
      auth
        .createUserWithEmailAndPassword(row[5], 'testtest')
        .then((userCredential) => {
          db.collection('users')
            .doc(userCredential.user.uid)
            .set({
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
              region: row[17],
              rut: row[3],
              sex: row[7]
            });
          db.collection('internships').add({
            applicationNumber: 1,
            status: 'Pendiente',
            studentId: userCredential.user.uid
          });
          db.collection('internships').add({
            applicationNumber: 2,
            status: 'No disponible',
            studentId: userCredential.user.uid
          });
        });
    });*/
    console.log(list);
    axios.post(
      'https://us-central1-gestion-practicas.cloudfunctions.net/importUsers',
      {
        data: list
      }
    );
  }

  return (
    <Box pad='medium'>
      <Heading level='1'>Importar estudiantes</Heading>
      <FileInput
        accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        onChange={handleFileUpload}
      />
      <Table margin='large'>
        <TableHeader>
          <TableRow>
            <TableCell scope='col' border='bottom'>
              Nombre alumno
            </TableCell>
            <TableCell scope='col' border='bottom'>
              Carrera
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((row) => {
            return (
              <TableRow>
                <TableCell scope='row'>{row[4]}</TableCell>
                <TableCell scope='row'>{row[0]}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button label='Confirmar' onClick={handleSubmit} />
    </Box>
  );
}

export default ImportStudents;
