import { observable, extendObservable } from 'mobx';
import { REFRESH_STEPS, BILLABILITY_TYPE } from './const';

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

let dataRefreshTimeout;
export function refreshData() {
  return fetch('/api/data', { credentials: 'same-origin' }).then(data => data.json()).then((newData) => {
    console.debug('Data recieved:', newData);

    /**
     * If there are employees, calculate all their billabilities now
     */
    if (newData.Employees) {
      newData.Employees.forEach((employee) => {

        // Default for ScheduleAverageHours
        employee.ScheduleAverageHours = employee.ScheduleAverageHours || 0;

        employee.billability = {};
        newData.weeks.forEach((week) => {
          employee.billability[week] = {};

          let maxHours = employee.ScheduleAverageHours;

          const timeException = employee.TimeExceptions.find((te) => (
            (te.from ? te.from <= week : true)
            &&
            (te.to ? te.to >= week : true)
          ));

          if (timeException) maxHours = timeException.quantity;

          Object.values(BILLABILITY_TYPE).forEach((billabilityType) => {
            employee.billability[week][billabilityType] = {
              billableHours: 0,
            };
            employee.timeTransactions[week].forEach((tt) => {
              employee.billability[week][billabilityType].billableHours
                += (tt.Quantity * tt.billability[billabilityType]);
            });
          });

          if (timeException && timeException.quantity < 0) {
            maxHours = employee.billability[week][BILLABILITY_TYPE.HOURS_REGISTERED].billableHours;
          }

          Object.values(employee.billability[week]).forEach((billability) => {
            billability.maxHours = parseFloat(maxHours.toFixed(2));
            billability.billableHours = parseFloat(billability.billableHours.toFixed(2));
            billability.billability = billability.billableHours / billability.maxHours;
          });
        });
      });
    }

    if (newData.timestamp) newData.timestamp = new Date(newData.timestamp);

    extendObservable(data, newData);

    clearTimeout(dataRefreshTimeout);
    if (data.state !== REFRESH_STEPS.DONE) {
      dataRefreshTimeout = setTimeout(refreshData, 1000);
    }
  });
}

refreshData();
