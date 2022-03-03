import React from 'react';
import { Route, Routes } from 'react-router-dom';
import InternshipList from './InternshipList';
import RemarkHistory from './RemarkHistory';
import SendEvaluation from './../dynamicForm/send/SendEvaluation';

function DashboardEmployer() {
  return (
    <Routes>
      <Route path='/' element={<InternshipList />} />
      <Route path='/remark-history/:internshipId' element={<RemarkHistory />} />
      <Route
        path='/send-evaluation/:internshipId'
        element={<SendEvaluation />}
      />
    </Routes>
  );
}

export default DashboardEmployer;
