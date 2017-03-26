
import React from 'react';
import Billability from '../Billability';
import styles from './styles.scss';

function Home() {
  return (
    <section>
      <p className={styles.paragraph}>
        <a href="/api/refresh">Refresh data from Exact Online</a> - <a href="/logout">Log out</a>
      </p>
      <Billability />
    </section>
  );
}

export default Home;
