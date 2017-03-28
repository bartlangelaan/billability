import React, {Component} from 'react';
import ReactTable from 'react-table';
import {observer}  from 'mobx-react';
import PersonModal from '../PersonModal';
import {BILLABILITY_TYPE, GROUP_TYPES} from '../const';
import data, {refreshData} from '../data';
import settings from '../settings';
import '!style!css!postcss!react-table/react-table.css';

const sum = arr => arr.reduce((p, c) => p + c, 0);

class Billability extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  openModel(a) {
    this.setState({
      modal: <PersonModal person={a} data={data} onRequestClose={() => this.setState({modal: null})}/>
    });
  }

  getGroup(employee) {
    const heads = ['José', 'Hans', 'Jeroen', 'Martine'];
    const name = employee.data.FullName.split(' ')[0];
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
          return 'PM'
        } else if (['Ian', 'Patrick', 'Hanneke', 'Bart', 'Chun'].includes(name) || employee.data.FullName == 'Matthijs Perik') {
          return 'Dev-red';
        } else if (['Ivo', 'Matthijs', 'Rick', 'Niels', 'Peter'].includes(name)) {
          return 'Dev-blue';
        } else if (['Kai', 'Erik', 'Daniël', 'Floris', 'Veerle'].includes(name)) {
          return 'Con-dev'
        } else if (['Daan', 'Jantine', 'Robert'].includes(name)) {
          return 'Design'
        } else if (name == 'Roël') {
          return 'Q-A';
        } else if (name == 'Sandra') {
          return 'Insights'
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
      <div>
        {this.state.modal}
        <select onChange={({target}) => settings.billabilityType = target.value} value={settings.billabilityType}>
          {Object.keys(BILLABILITY_TYPE).map(key => <option key={key}>{BILLABILITY_TYPE[key]}</option>)}
        </select>
        <select onChange={({target}) => settings.groupType = target.value} value={settings.groupType}>
          {Object.keys(GROUP_TYPES).map(key => <option key={key}>{GROUP_TYPES[key]}</option>)}
        </select>
        <input onBlur={({target}) => settings.from = target.value} defaultValue={settings.from} />
        <input onBlur={({target}) => settings.from = target.value} defaultValue={settings.to} />

        <ReactTable
          pivotBy={['group']}
          columns={[
            {
              header: 'Employee',
              columns: [
                {header: 'Group', accessor: (row) => this.getGroup(row), minWidth: 150, id: 'group'},
                {
                  header: 'Name',
                  accessor: 'data.FullName',
                  render: ({value, row}) => <span title={value}
                                                  onClick={() => this.openModel(row)}>{row ? row.data.FirstName : null}</span>
                },
                {header: 'H/W', accessor: row => row.data.ScheduleAverageHours || 0, aggregate: sum, maxWidth: 50, id: 'h/w'},
              ],
            },
            {
              header: 'Billability',
              columns: data.weeks.filter(week => settings.from <= week && week <= settings.to).map(week => ({
                header: week,
                id: `billability-${week}`,
                accessor: employee => employee.billability(week),
                render: BillabilityNumber,
                style: {textAlign: 'right', overflow: 'visible'},
                aggregate: (billibilities) =>
                (
                  sum(billibilities.map(b => b.billability * b.totalTime))
                  /
                  sum(billibilities.map(b => b.totalTime))
                ) || 0
                ,
                maxWidth: 80
              }))
            }
          ]}
          data={data.Employees}
        />
      </div>
    )
  }

}

const BillabilityNumber = ({row, value, aggregated}) => {

  if (aggregated) return (
    <span title="Aggregated value">{(value * 100).toFixed(1)} %</span>
  );

  // Check if all transactions are only billable or not-billable, and not .4 billable for example
  const variableBillabilities = value.transactionBillabilities.find(tb => tb.billability !== 0 && tb.billability !== 1);



  const title = `Billable ${value.billability * 100} % of ${value.totalTime} hours\n` + value.transactionBillabilities.map(tb => {

    const project = tb.transaction.project;

    // Billability rate
    return (variableBillabilities ?
          // If there are other numbers then 0 and 1, show like 40 % or 100 %
          (tb.billability * 100).toFixed() + '%' :
          (tb.billability ? '✅' : '❎')
      )
      // Show the number of hours of this transaction, like 0.4
      + ' ' + tb.quantity.toFixed(1) + ' - '
      // Show the notes of this transaction, or the project if no note is available
      + (tb.transaction.data.Notes ?
        tb.transaction.data.Notes + ' (' + project.Description + ')' :
        project.Description)
  }).join('\n');

  return (
    <span title={title}>{
      (value.totalTime == 0) ? '-' : (value.billability * 100).toFixed(1) + ' %'
    }</span>
  );

}

export default observer(Billability);
