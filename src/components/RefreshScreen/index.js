import React from 'react';
import data from '../data';
import DashboardPage from '../DashboardPage';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { observer } from 'mobx-react';
import { REFRESH_STEPS } from '../const';
import styles from './styles.css';

const RefreshPart = observer(({ step, statsProperty, name }) => {
  const s = data.state;
  if (s < step) {
    return <CardText className={styles.todo}>Need to load all {name}..</CardText>;
  } else if (s === step) {
    return (
      <div>
        <CardText className={styles.busy}>Loading all {data.stats[`${statsProperty}Total`]} {name}..</CardText>
        <ProgressBar mode="determinate" value={data.stats[`${statsProperty}Loaded`]} max={data.stats[`${statsProperty}Total`]} />
      </div>
    );
  } else {
    return <CardText className={styles.done}>Loaded {data.stats[`${statsProperty}Loaded`]} {name}.</CardText>;
  }
});

function RefreshScreen() {
  const s = data.state;

  return (
    <DashboardPage contentClassName={styles.wrapper}>
      <Card className={styles.card}>
        <CardTitle
          title="Refreshing data from Exact Online.."
        />

        {s > REFRESH_STEPS.INIT ? (
          <CardText className={styles.done}>Logged into Exact Online.</CardText>
        ) : (
          <div>
            <CardText className={styles.busy}>Logging into Exact Online..</CardText>
            <ProgressBar value={100} mode="determinate" />
          </div>
        )}

        <RefreshPart
          step={REFRESH_STEPS.LOADING_TIME_TRANSACTIONS}
          statsProperty="timeTransactions"
          name="time transactions"
        />
        <RefreshPart
          step={REFRESH_STEPS.LOADING_ACTIVE_EMPLOYMENTS}
          statsProperty="activeEmployments"
          name="active employments"
        />
        <RefreshPart
          step={REFRESH_STEPS.LOADING_EMPLOYEES}
          statsProperty="employees"
          name="employees"
        />
        <RefreshPart
          step={REFRESH_STEPS.LOADING_PROJECTS}
          statsProperty="projects"
          name="projects"
        />

        {s === REFRESH_STEPS.CALCULATING ? (
          <div>
            <CardText className={styles.busy}>Calculating billability</CardText>
            <ProgressBar />
          </div>
        ) : (
          <CardText className={styles.todo}>Need to calculate billability.. {null}</CardText>
        )}

      </Card>
    </DashboardPage>
  );
}

export default observer(RefreshScreen);
