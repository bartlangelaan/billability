import { BILLABILITY_TYPE, GROUP_TYPES } from '../const';
import * as store from '../data';

export function isBillable(transaction) {
  switch (store.billabilityType.get()) {
    case BILLABILITY_TYPE.HOURS_REGISTERED:
      return true;
    case BILLABILITY_TYPE.HOURS_REGISTERED_BILLABLE_PROJECT:
      return store.data.projects[transaction.Project].Type != 4;
  }
}

export function calculateBillability(employee, week, raw = false) {
  const billableItems = [];
  const nonBillableItems = [];

  (employee.timeTransactionsPerWeek[week] || []).forEach((transaction) => {
    if (this.isBillable(transaction)) {
      billableItems.push(transaction);
    }
    else {
      nonBillableItems.push(transaction);
    }
  });

  const billableTime = billableItems.reduce((sum, transaction) => sum + transaction.Quantity, 0);

  const totalTime = employee.ScheduleAverageHours;

  let billable = billableTime / totalTime;

  if (isNaN(billable)) {
    billable = 1;
  }

  if (raw) {
    return billable;
  }

  const billableText = `${(billable * 100).toFixed(2)} %`;

  const infoFromItem = item => <div>{item.Quantity.toFixed(1)} - {(item.Notes || item.ProjectDescription).substring(0, 30)}</div>;

  const quantity = (a, b) => b.Quantity - a.Quantity;

  const billableInfo = [
    (billableItems.length ? <h3>BILLABLE</h3> : null),
    ...billableItems.sort(quantity).map(infoFromItem),
    (nonBillableItems.length ? <h3>NON-BILLABLE</h3> : null),
    ...nonBillableItems.sort(quantity).map(infoFromItem),
  ];

  return <Tooltip content={billableInfo} styles={{ content: { textAlign: 'left' } }}>{billableText}</Tooltip>;
}
