import React from 'react';
import { observer } from 'mobx-react';
import Billability from '../Billability';
import DashboardPage from '../DashboardPage';
import data from '../data';
import { REFRESH_STEPS } from '../const';
import LoadingScreen from '../LoadingScreen';
import LoginScreen from '../LoginScreen';
import RefreshScreen from '../RefreshScreen';
import './styles.css';

function App() {
  const s = data.state;

  if (s === REFRESH_STEPS.NOT_LOADED_YET) {
    return <LoadingScreen />;
  } else if (s === REFRESH_STEPS.NOT_AUTHENTICATED) {
    return <LoginScreen />;
  } else if (s === REFRESH_STEPS.ERROR) {
    return (<DashboardPage>
      <h3>Error loading Exact Online data (error {data.stats.error.statusCode})</h3>
      <code><pre>{data.stats.error.data}</pre></code>
    </DashboardPage>);
  } else if (s === REFRESH_STEPS.DONE) {
    return <Billability />;
  }

  return <RefreshScreen />;
}

export default observer(App);
