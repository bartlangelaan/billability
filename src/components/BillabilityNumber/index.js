import React from 'react';
import { observer } from 'mobx-react';
import Tooltip from 'react-toolbox/lib/tooltip';
import { BILLABILITY_TYPE } from '../const';
import settings from '../settings';
import data from '../data';
import styles from './styles.css';

const TooltipSpan = Tooltip('span');

const BillabilityNumber = ({ week, subRows, row, value, aggregated }) => {
  if (isNaN(value)) return null;

  const tooltip = aggregated
    ?
      (
        <div>
          <table>
            <tbody>
              {subRows.map(employee => {
                const b = employee.__original.billability[week][settings.billabilityType];
                if(b.billableHours === 0 && b.maxHours === 0) return null;
                return (
                  <tr key={employee.ID} className={styles.tableRow}>
                    <td className={styles.right}>{employee.__original.FirstName}</td>
                    <td className={styles.right}>{b.billableHours}</td>
                    <td>/</td>
                    <td>{b.maxHours}</td>
                    <td>=</td>
                    <td className={styles.right}>
                      {((b.billableHours / b.maxHours) * 100).toFixed(1)} %
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )
    :
      (
      <div>
        Was <em>{row.billability[week][settings.billabilityType].billableHours}</em> out of <em>{row.billability[week][settings.billabilityType].maxHours} hours</em> billable.
        <table>
          <tbody>
            {
              row.timeTransactions[week]
                .sort((tt1, tt2) => {
                  const b = tt1.billability[settings.billabilityType] - tt2.billability[settings.billabilityType];
                  return !b ? tt2.Quantity - tt1.Quantity : b;
                })
                .map((tt, i) => (
                  <tr className={styles.tableRow} key={i}>
                    <td className={styles.right}>
                      {tt.billability[settings.billabilityType] * 100} %
                    </td>
                    <td className={styles.right}>
                      {tt.Quantity} H
                    </td>
                    <td>{tt.Notes}</td>
                    <td>{(data.Projects[tt.Project] || {}).Description}</td>
                  </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  ;

  return (
    <TooltipSpan
      tooltip={tooltip}
      tooltipShowOnClick
      theme={styles}
    >
      {(value === Infinity) ? '∞' : `${(value * 100).toFixed(1)} %`}
    </TooltipSpan>
  );
};

export default observer(BillabilityNumber);
