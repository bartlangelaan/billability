import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Button from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import styles from './styles.css';
import classnames from 'classnames';
import data from '../data';
import { REFRESH_STEPS } from '../const';
const TooltipButton = Tooltip(Button);

function DashboardPage({ children, contentClassName }) {
  const refreshing = data.state >= REFRESH_STEPS.INIT && data.state < REFRESH_STEPS.DONE;
  return (
    <div className={styles.wrapper}>
      <AppBar title="Billability">
        <TooltipButton
          primary raised inverse
          href="/api/refresh"
          disabled={refreshing}
          tooltip={refreshing ? 'Refreshing right now..' : (data.timestamp ? `Last refresh: ${data.timestamp.toLocaleDateString()} ${data.timestamp.toLocaleTimeString()}` : 'Last refresh time unknown')}
        >
          Refresh
        </TooltipButton>
        &nbsp;
        <Button flat inverse href="/logout">
          Log out
        </Button>
      </AppBar>
      <div className={classnames(styles.content, contentClassName)}>
        {children}
      </div>

    </div>
  );
}

export default DashboardPage;
