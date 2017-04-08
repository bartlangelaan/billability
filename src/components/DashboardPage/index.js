import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Button from 'react-toolbox/lib/button';
import styles from './styles.css';
import classnames from 'classnames';
import data from '../data';
import { REFRESH_STEPS } from '../const';

function DashboardPage({children, contentClassName}) {
  return (
    <div className={styles.wrapper}>
      <AppBar title="Billability">
        <Button primary raised inverse href="/api/refresh" disabled={data.state >= REFRESH_STEPS.INIT && data.state < REFRESH_STEPS.DONE}>
          Refresh
        </Button>
        &nbsp;
        <Button flat inverse href="/logout">
          Log out
        </Button>
      </AppBar>
      <div className={classnames(styles.content, contentClassName)}>
        {children}
      </div>

    </div>
  )
}

export default DashboardPage;
