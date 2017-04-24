import React from 'react';
import { observer } from 'mobx-react';

const BillabilityNumber = ({ row, value, aggregated }) => {
  if (isNaN(value)) return null;
  if (value === Infinity) return <span>∞</span>;

  return (
    <span>{(value * 100).toFixed(1)} %</span>
  );
};

export default observer(BillabilityNumber);
