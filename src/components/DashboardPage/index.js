import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Button from 'react-toolbox/lib/button';

function DashboardPage({children}) {
  return (
    <div>
      <AppBar title="Billability">
        <Button primary raised inverse href="/api/refresh">
          Refresh
        </Button>
        &nbsp;
        <Button flat inverse href="/logout">
          Log out
        </Button>
      </AppBar>

      {children}

    </div>
  )
}

export default DashboardPage;
