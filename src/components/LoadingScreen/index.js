import React from 'react';
import styles from './styles.css';

function LoadingScreen() {
  return <div className={styles.wrapper}>
    <div className={styles.spinner}>
      <div /><div /><div /><div /><div />
    </div>
  </div>
}

export default LoadingScreen;
