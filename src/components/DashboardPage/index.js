import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Button from 'react-toolbox/lib/button';
import styles from './styles.css';

function DashboardPage({children}) {
  return (
    <div className={styles.wrapper}>
      <AppBar title="Billability">
        <Button primary raised inverse href="/api/refresh">
          Refresh
        </Button>
        &nbsp;
        <Button flat inverse href="/logout">
          Log out
        </Button>
      </AppBar>
      <div className={styles.content}>
        {children}
      </div>

    </div>
  )
}

export default DashboardPage;
