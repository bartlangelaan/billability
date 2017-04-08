import React from 'react';
import {Button} from 'react-toolbox/lib/button';
import styles from './styles.css';

function LoginScreen() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.innerWrapper}>
        <h1>Billability <span className={styles.poweredBy}>for Exact Online</span></h1>
        <p>Measure the billability of all employees, on a weekly basis.</p>
        <p>
          <Button href='http://github.com/bartlangelaan/billability' target='_blank' raised>
            View source code
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button href='/login' raised primary>
            Log in
          </Button>
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;
