import React from 'react';
import data from '../data';
import DashboardPage from '../DashboardPage';
import { REFRESH_STEPS } from '../const';

function RefreshScreen() {

  const s = data.state;

  return (
    <DashboardPage>
      <ul>
        <li>{s > REFRESH_STEPS.INIT ? '✅' : ''} Logging in to Exact Online</li>
        <li>{s > REFRESH_STEPS.LOADING_TIME_TRANSACTIONS ? '✅' : ''} Loading all time transactions ({data.stats.timeTransactionsLoaded} loaded)</li>
        <li>{s > REFRESH_STEPS.LOADING_ACTIVE_EMPLOYMENTS ? '✅' : ''} Loading all active employments ({data.stats.activeEmploymentsLoaded} loaded)</li>
        <li>{s > REFRESH_STEPS.LOADING_EMPLOYEES ? '✅' : ''} Loading all employees ({data.stats.employeesLoaded} loaded)</li>
        <li>{s > REFRESH_STEPS.LOADING_PROJECTS ? '✅' : ''} Loading all projects ({data.stats.projectsLoaded} loaded)</li>
        <li>Calculating billability...</li>
      </ul>
    </DashboardPage>
  );
}

export default RefreshScreen;
