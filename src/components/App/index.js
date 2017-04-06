
import React, { Component } from 'react';
import Billability from '../Billability';
import data, {refreshData} from '../data';
import { REFRESH_STEPS } from '../const';
import LoadingScreen from '../LoadingScreen';
import LoginScreen from '../LoginScreen';
import './styles.css';

class App extends Component {

  componentDidMount() {
    this.refreshData()
  }

  refreshData() {
    clearTimeout(this.dataRefreshTimeout);
    refreshData().then(() => this.forceUpdate()).then(() => {
      if(data.state !== REFRESH_STEPS.DONE) {
        this.dataRefreshTimeout = setTimeout(() => this.refreshData(), 1000)
      }
    });
  }

  render() {

    let result;

    const s = data.state;

    if(s === REFRESH_STEPS.NOT_LOADED_YET) {
      return <LoadingScreen/>;
    }
    else if(s === REFRESH_STEPS.NOT_AUTHENTICATED) {
      return <LoginScreen/>
    }
    else if(s === REFRESH_STEPS.ERROR) {
      result = <div>
        <h3>Error loading Exact Online data (error {data.stats.error.statusCode})</h3>
        <code><pre>{data.stats.error.data}</pre></code>
      </div>;
    }
    else if(s === REFRESH_STEPS.DONE) {
      result = <Billability/>;
    }
    else {
      result = (
        <ul>
          <li>{s > REFRESH_STEPS.INIT ? '✅' : ''} Logging in to Exact Online</li>
          <li>{s > REFRESH_STEPS.LOADING_TIME_TRANSACTIONS ? '✅' : ''} Loading all time transactions ({data.stats.timeTransactionsLoaded} loaded)</li>
          <li>{s > REFRESH_STEPS.LOADING_ACTIVE_EMPLOYMENTS ? '✅' : ''} Loading all active employments ({data.stats.activeEmploymentsLoaded} loaded)</li>
          <li>{s > REFRESH_STEPS.LOADING_EMPLOYEES ? '✅' : ''} Loading all employees ({data.stats.employeesLoaded} loaded)</li>
          <li>{s > REFRESH_STEPS.LOADING_PROJECTS ? '✅' : ''} Loading all projects ({data.stats.projectsLoaded} loaded)</li>
          <li>Calculating billability...</li>
        </ul>
      );
    }

    return (
      <div>
        <p>
          <a href="/api/refresh">Refresh data from Exact Online</a> - <a href="/logout">Log out</a>
        </p>

        {result}

      </div>
    );
  }
}

export default App;
