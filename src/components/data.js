import { observable, extendObservable, autorun } from 'mobx';
import Employee from '../classes/Employee';
import TimeTransaction from '../classes/TimeTransaction';
import { REFRESH_STEPS } from './const';

const data = observable({
  Employees: [],
  Projects: new Map(),
  weeks: [],
  timeExceptions: [],
  state: REFRESH_STEPS.NOT_LOADED_YET,
  timestamp: null,
  stats: {
    error: {},
  },
});

export default data;

export function refreshData() {
  return fetch('/api/data', { credentials: 'same-origin' }).then(data => data.json()).then((newData) => {
    console.debug('Data recieved:', newData);

    if (newData.Employees) {
      newData.Employees.forEach(employee => Object.keys(employee.timeTransactions).forEach((week) => {
        employee.timeTransactions[week] = employee.timeTransactions[week].map(tt => new TimeTransaction(tt));
      }));

      newData.Employees = newData.Employees.map(e => new Employee(e));
    }

    if (newData.timestamp) newData.timestamp = new Date(newData.timestamp);

    extendObservable(data, newData);

    console.log('Now the data is:', data);
  });
}


let dataRefreshTimeout;
autorun(() => {
  clearTimeout(dataRefreshTimeout);
  if (data.state !== REFRESH_STEPS.DONE) {
    dataRefreshTimeout = setTimeout(refreshData, 1000);
  }
});

refreshData();
