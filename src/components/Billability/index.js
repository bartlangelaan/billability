import React, { Component } from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import Input from 'react-toolbox/lib/input';
import ReactTable from 'react-table';
import '!style!css!postcss!react-table/react-table.css'; // eslint-disable-line import/no-unresolved
import { observer } from 'mobx-react';
import DashboardPage from '../DashboardPage';
import { BILLABILITY_TYPE, GROUP_TYPES } from '../const';
import data from '../data';
import settings from '../settings';
import BillabilityNumber from '../BillabilityNumber/index';
import styles from './styles.css';

const sum = arr => arr.reduce((p, c) => p + c, 0);

class Billability extends Component {

  getGroup(employee) {
    const heads = ['José', 'Hans', 'Jeroen', 'Martine'];
    const name = employee.FullName.split(' ')[0];
    switch (settings.groupType) {
      case GROUP_TYPES.NONE:
        return 'All';
      case GROUP_TYPES.COUNTABLE:
        if (heads.includes(name)) return 'Not counted';
        return 'Counted';
      case GROUP_TYPES.TEAMS:
        if (['Anouk', 'Marvin', 'Kyra'].includes(name)) {
          return 'AM';
        } else if (heads.includes(name)) {
          return 'Head';
        } else if (['Kim', 'Manon', 'Aniek'].includes(name)) {
          return 'PM';
        } else if (['Ian', 'Patrick', 'Hanneke', 'Bart', 'Chun'].includes(name) || employee.FullName === 'Matthijs Perik') {
          return 'Dev-red';
        } else if (['Ivo', 'Matthijs', 'Rick', 'Niels', 'Peter'].includes(name)) {
          return 'Dev-blue';
        } else if (['Kai', 'Erik', 'Daniël', 'Floris', 'Veerle'].includes(name)) {
          return 'Con-dev';
        } else if (['Daan', 'Jantine', 'Robert'].includes(name)) {
          return 'Design';
        } else if (name == 'Roël') {
          return 'Q-A';
        } else if (name == 'Sandra') {
          return 'Insights';
        } else if (name == 'Cies') {
          return 'Ext';
        } else {
          return 'Unknown';
        }
    }
    return 'No group';
  }

  render() {
    return (
      <DashboardPage>
        <div className={styles.settings}>
          <Dropdown
            onChange={(value) => { settings.billabilityType = value; }}
            value={settings.billabilityType}
            source={Object.values(BILLABILITY_TYPE).map(value => ({ value, label: value }))}
            className={styles.typeSetting}
            label="Billability is measured by"
          />

          <Dropdown
            onChange={(value) => { settings.groupType = value; }}
            value={settings.groupType}
            source={Object.values(GROUP_TYPES).map(value => ({ value, label: value }))}
            className={styles.groupSetting}
            label="Group by"
          />

          <Input
            onChange={value => settings.from = value}
            value={settings.from}
            label="From week"
          />
          <Input
            onChange={value => settings.to = value}
            value={settings.to}
            label="To week"
          />
        </div>

        <ReactTable
          showPagination={false}
          pageSize={new Set(data.Employees.map(employee => this.getGroup(employee))).size}
          pivotBy={['group']}
          columns={[
            {
              header: 'Employee',
              columns: [
                { header: 'Group', accessor: row => this.getGroup(row), minWidth: 150, id: 'group' },
                {
                  header: 'Name',
                  accessor: 'FullName',
                  render: ({ value, row }) =>
                    <span title={value}>{row ? row.FirstName : null}</span>,
                },
                { header: 'H/W', accessor: row => row.ScheduleAverageHours || 0, aggregate: sum, maxWidth: 50, id: 'h/w' },
              ],
            },
            {
              header: 'Billability',
              columns: data.weeks
                .filter(week => settings.from <= week && week <= settings.to)
                .map(week => ({
                  header: week,
                  id: `billability-${week}`,
                  accessor: employee =>
                    employee.billability[week][settings.billabilityType].billability,
                  render: (props) => (<BillabilityNumber {...props} week={week} />),
                  style: { textAlign: 'right', overflow: 'visible' },
                  aggregate: (_, employees) => (
                    sum(employees.map(employee =>
                      employee.__original.billability[week][settings.billabilityType].billableHours
                    ))
                    /
                    sum(employees.map(employee =>
                      employee.__original.billability[week][settings.billabilityType].maxHours
                    ))
                  ),
                  maxWidth: 80,
                })),
            },
          ]}
          data={data.Employees}
        />
      </DashboardPage>
    );
  }

}

export default observer(Billability);
