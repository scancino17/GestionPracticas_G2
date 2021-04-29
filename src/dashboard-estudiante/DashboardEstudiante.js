import {
  Accordion,
  AccordionPanel,
  Button,
  Heading,
  Main,
  Text
} from 'grommet';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/Auth';
import Documentos from './extras/Documentos';
import Practicas from './extras/Practicas';
import axios from 'axios';
import { db } from '../firebase';

function DashboardEstudiante() {
  const { user, logout } = useAuth();
  const [docs, setDocs] = useState();
  const [practicas, setPracticas] = useState();
  const [userData, setUserData] = useState();
  const [careerInternshipInfo, setCareerInternshipInfo] = useState();

  useEffect(() => {
    axios.get('https://rickandmortyapi.com/api/character').then((res) => {
      setDocs(res.data.results);
    });

    axios.get('https://rickandmortyapi.com/api/character').then((res) => {
      setPracticas(res.data.results);
    });

    db.collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => {
        setUserData(doc.data());
      });
    console.log(userData);

    //db.collection('careerInternshipInfo').where('');
  }, []);

  return (
    <Main pad='xlarge'>
      <Heading>¡Hola, {userData && userData.name}!</Heading>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Text>

      <Accordion>
        <AccordionPanel label='Documentos'>
          <Documentos docs={docs} />
        </AccordionPanel>
        <AccordionPanel label='Prácticas'>
          <Practicas practicas={practicas} />
        </AccordionPanel>
      </Accordion>

      <Button primary label='Sign Out' onClick={logout} />
    </Main>
  );
}

export default DashboardEstudiante;
