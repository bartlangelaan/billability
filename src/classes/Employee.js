import data from '../components/data';

class Employee {

  constructor(data){
    this.data = data;
  }

  maxHours(week = '0000-00', totalQuantityThisWeek) {
    const timeException = data.timeExceptions.find(timeException => (
        timeException.employee == this.data.ID
      &&
        (timeException.from ? timeException.from <= week : true)
      &&
        (timeException.to ? timeException.to >= week : true)
    ));
    if(timeException && timeException.quantity < 0) return totalQuantityThisWeek;
    if(timeException) return timeException.quantity;
    return this.data.ScheduleAverageHours || 0;
  }

  billability(week) {

    const transactions = data.TimeTransactions.filter(tt => tt.data.Employee == this.data.ID && tt.week == week);

    const transactionBillabilities = transactions.map(transaction => ({
      billability: transaction.billability(),
      quantity: transaction.data.Quantity,
      transaction
    })).sort((t1, t2) => (t1.billability != t2.billability) ? (t1.billability - t2.billability) : (t2.quantity - t1.quantity));

    const billableTime = transactionBillabilities.reduce((sum, transaction) => sum + (transaction.billability * transaction.quantity), 0);

    const totalTime = this.maxHours(week, transactionBillabilities.reduce((sum, tr) => sum + tr.quantity, 0));

    let billable = billableTime / totalTime;

    if(isNaN(billable) || billable == Infinity) {
      billable = 1;
    }

    return {
      billability: billable,
      totalTime,
      transactionBillabilities
    };
  }


}

export default Employee;
