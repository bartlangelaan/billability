import { observable, extendObservable } from 'mobx';
import { BILLABILITY_TYPE, GROUP_TYPES } from './const';

const settings = observable({
  billabilityType: BILLABILITY_TYPE.HOURS_REGISTERED_BILLABLE_PROJECT,
  groupType: GROUP_TYPES.COUNTABLE,
  from: '2016-50',
  to: '2018-01'
});

export default settings;
