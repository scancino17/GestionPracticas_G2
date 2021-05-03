import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  List,
  Main,
  Text
} from 'grommet';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';

function ApplicationsList() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    db.collection('applications')
      .get()
      .then((querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) =>
          list.push({ id: doc.id, ...doc.data() })
        );
        setApplications(list);
      });
  }, []);

  return (
    <Main>
      <Heading>Postulaciones realizadas</Heading>
      <Box>
        <List data={applications}>
          {(item) => (
            <Card>
              <CardHeader>{item.name}</CardHeader>
              <CardBody>
                <Text>{`Práctica ${item.applicationNumber}`}</Text>
                <Text>{item.companyName}</Text>
              </CardBody>
            </Card>
          )}
        </List>
      </Box>
    </Main>
  );
}

export default ApplicationsList;
