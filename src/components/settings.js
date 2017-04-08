import { observable, extendObservable, autorun } from 'mobx';
import { BILLABILITY_TYPE, GROUP_TYPES } from './const';

const settings = observable({
  billabilityType: localStorage.getItem('settings.billabilityType') || BILLABILITY_TYPE.HOURS_REGISTERED_BILLABLE_PROJECT_NOT_OVERSPENT,
  groupType: localStorage.getItem('settings.groupType') || GROUP_TYPES.COUNTABLE,
  from: localStorage.getItem('settings.from') || '2016-50',
  to: localStorage.getItem('settings.to') || '2018-01',
});

autorun(() => {
  localStorage.setItem('settings.billabilityType', settings.billabilityType);
  localStorage.setItem('settings.groupType', settings.groupType);
  localStorage.setItem('settings.from', settings.from);
  localStorage.setItem('settings.to', settings.to);
});

export default settings;
