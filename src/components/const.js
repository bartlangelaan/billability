export const BILLABILITY_TYPE = {
  HOURS_REGISTERED: 'Hours registrated on a project',
  HOURS_REGISTERED_BILLABLE_PROJECT: 'Hours registrated on a billable project',
  HOURS_REGISTERED_BILLABLE_PROJECT_NOT_OVERSPENT: 'Hours registrated on a billable project not yet overspent',
  HOURS_REGISTERED_BILLABLE_PROJECT_TYPE_NOT_OVERSPENT: 'Hours registrated on a billable project not yet overspent on that category',
};

export const GROUP_TYPES = {
  COUNTABLE: 'Counted towards billability',
  TEAMS: 'Teams',
  NONE: 'None',
};

export const REFRESH_STEPS = {
  INIT: 0,
  LOADING_TIME_TRANSACTIONS: 1,
  LOADING_ACTIVE_EMPLOYMENTS: 2,
  LOADING_EMPLOYEES: 3,
  LOADING_PROJECTS: 4,
  CALCULATING: 5,
  DONE: 6,
  ERROR: -1,
  NOT_LOADED_YET: 99,
  NOT_AUTHENTICATED: 98,
};
