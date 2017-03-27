
import React, { PropTypes } from 'react';
import Billability from '../Billability';

function App() {
  return (
    <div>
      <a href="/api/refresh">Refresh data from Exact Online</a> - <a href="/logout">Log out</a>
      <Billability />
    </div>
  );
}

export default App;
