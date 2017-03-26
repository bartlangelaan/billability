
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

    newData.Employees = newData.Employees.map(e => new Employee(e));

    newData.TimeTransactions = newData.TimeTransactions.map(tt => new TimeTransaction(tt));

    newData.Projects = new Map(newData.Projects.map(p => [p.ID, p]));

    newData.weeks = Array.from(new Set(newData.TimeTransactions.map(tt => tt.week)));

    Object.assign(data, newData);

    console.log('Now the data is:', data);

  });
}
