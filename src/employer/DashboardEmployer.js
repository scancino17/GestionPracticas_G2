import React from 'react';
import { Route, Routes } from 'react-router-dom';
import InternshipList from './InternshipList';

function DashboardEmployer() {
  return (
    <Routes>
      <Route exact path='/' element={<InternshipList />} />
    </Routes>
  );
}

export default DashboardEmployer;
