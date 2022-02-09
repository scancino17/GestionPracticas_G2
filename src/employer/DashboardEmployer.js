import React from 'react';
import { Route, Routes } from 'react-router-dom';
import InternshipList from './InternshipList';
import RemarkHistory from './RemarkHistory';

function DashboardEmployer() {
  return (
    <Routes>
      <Route exact path='/' element={<InternshipList />} />
      <Route path='/remark-history/:internshipId' element={<RemarkHistory />} />
    </Routes>
  );
}

export default DashboardEmployer;
