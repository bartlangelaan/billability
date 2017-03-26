import { BILLABILITY_TYPE, GROUP_TYPES } from '../components/const';
import data from '../components/data';
import settings from '../components/settings';
import weekNumber from 'current-week-number';
class TimeTransaction {
  constructor(data){
    this.data = data;
    this.date = new Date(this.data.Date);

    const week = weekNumber(this.date);
    const year = this.date.getFullYear();
    this.week = `${week == 53 && this.date.getMonth() == 0 ? year - 1 : year}-${week.toString().padStart(2, "0")}`;
  }

  get project() {
    return data.Projects.get(this.data.Project);
  }

  billability() {
    switch(settings.billabilityType) {
      case BILLABILITY_TYPE.HOURS_REGISTERED:
        return 1;
      case BILLABILITY_TYPE.HOURS_REGISTERED_BILLABLE_PROJECT:
        return this.project.Type == 4 ? 0 : 1;
      case BILLABILITY_TYPE.HOURS_REGISTERED_BILLABLE_PROJECT_NOT_OVERSPENT:
        return this.project.Type == 4 ? 0 : (this.data.WithinBudget || 0);
      case BILLABILITY_TYPE.HOURS_REGISTERED_BILLABLE_PROJECT_TYPE_NOT_OVERSPENT:
        return this.project.Type == 4 ? 0 : (this.data.WithinHourBudget || this.data.WithinBudget || 0);

    }
  }

}

export default TimeTransaction;
