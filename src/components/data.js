
import Employee from '../classes/Employee';
import TimeTransaction from '../classes/TimeTransaction';

const data = {
  Employees: [],
  Projects: new Map(),
  weeks: [],
  timeExceptions: [],
};

export default data;

export function refreshData() {
  return fetch('/api/data', {credentials: 'same-origin'}).then(data => data.json()).then(newData => {

    console.debug('Data recieved:', newData);

    newData.Employees.forEach(employee => Object.keys(employee.timeTransactions).forEach(week => {
      employee.timeTransactions[week] = employee.timeTransactions[week].map(tt => new TimeTransaction(tt));
    }));

    newData.Employees = newData.Employees.map(e => new Employee(e));

    Object.assign(data, newData);

    console.log('Now the data is:', data);

  });
}
