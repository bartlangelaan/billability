import Data from './models/Data';
import { get } from '../ExactOnline';

function parseDate(datestring) {
  if(!datestring) return null;
  return parseInt(datestring.substr(6, 13))
}

async function getAll(firstUrl, token) {
  const results = [];
  let nextUrl = firstUrl;
  let i = 0;
  while(nextUrl){

    console.log(`[${i.toString().padStart(4, '0')}] Requesting ${nextUrl}`);

    // Get the next batch
    const response = await get(nextUrl, token);

    // Add results to main array
    results.push(...response.d.results);

    // Extract the new url for next iteration
    nextUrl = response.d.__next;

    i++;
  }
  return results;
}

export default async function(req, res) {
  res.redirect('/');
  try {

    const BASE_URL = 'https://start.exactonline.nl/api/v1/' + req.user.profile.currentDivision;
    const TOKEN = req.user.accessToken;

    /**
     * First, recieve ALL time transactions.
     *
     * Date: "/Date(1482364800000)/"
     * Employee: [employeeId]
     * Notes: String || null
     * PriceFC: 110
     * Project: [projectId]
     * Quantity: 0.25
     */

    const Items = {};

    const TimeTransactions = (await getAll(
      BASE_URL + '/project/TimeTransactions?$select=Date,Employee,Item,ItemDescription,Notes,PriceFC,Project,Quantity',
      TOKEN
    )).map(timetransaction => {
      delete timetransaction.__metadata;
      Items[timetransaction.Item] = timetransaction.ItemDescription;
      delete timetransaction.ItemDescription;
      timetransaction.Date = parseDate(timetransaction.Date);
      return timetransaction;
    }).sort((tt1, tt2) => tt1.Date - tt2.Date);

    console.log(`All ${TimeTransactions.length} TimeTransactions recieved.\n`);


    /**
     * Get all active employments.
     *
     * Employee: [EmployeeID]
     * ScheduleAverageHours: 32
     */
    console.log(`Getting all Active Employments..`);

    const ActiveEmployments = await getAll(`${BASE_URL}/payroll/ActiveEmployments?$select=Employee,ScheduleAverageHours`, TOKEN);

    ActiveEmployments.forEach(employment => {
      delete employment.__metadata
    });

    console.log(`Recieved ${ActiveEmployments.length} employments.\n`)


    /**
     * Get all employees.
     *
     * ID: [EmployeeID]
     * FirstName: 'Bart'
     * FullName: 'Bart Langelaan'
     */
    console.log('Getting all employees..');

    const Employees = (await getAll(`${BASE_URL}/payroll/Employees?$select=ID,FirstName,FullName`, TOKEN)).map(employee => {
      delete employee.__metadata;
      const employment = ActiveEmployments.find(employment => employment.Employee == employee.ID) || {};
      delete employment.Employee;
      return {...employee, ...employment};
    });

    console.log(`Recieved ${Employees.length} employees.\n`);

    /**
     * ID: [ProjectID]
     * BudgetedAmount: 376
     * BudgetedHoursPerHourType:
     *   Budget: 28
     *   Item: [ProjectHourBudgetItem]
     *   ItemDescription: 'Developer'
     * Description:
     * EndDate:
     * Notes:
     * SalesTimeQuantity: 184.02
     * StartDate:
     * Type: 2  (2: Fixed price, 3: Time and Material, 4: Non billable)
     */
    const Projects = await getAll(`${BASE_URL}/project/Projects?$select=ID,BudgetedAmount,BudgetedHoursPerHourType,Description,EndDate,Notes,SalesTimeQuantity,StartDate,Type,TypeDescription&$expand=BudgetedHoursPerHourType`, TOKEN);

    Projects.forEach(project => {
      delete project.__metadata;
      project.BudgetedHoursPerHourType = project.BudgetedHoursPerHourType.results.map(({Budget, Item, ItemDescription}) => {
        Items[Item] = ItemDescription;
        return { Budget, Item, Spent: 0 };
      });
      project.StartDate = parseDate(project.StartDate);
      project.EndDate = parseDate(project.EndDate);

      // Loop trough all TimeTransactions for this project, and check if they are overspent.

      project.SpentTimeQuantity = 0;

      TimeTransactions.filter(tt => tt.Project == project.ID).forEach(tt => {

        // Check if overspent on project in general

        if(!project.SalesTimeQuantity) {
          tt.WithinBudget = null;
        }
        else if(project.SpentTimeQuantity + tt.Quantity < project.SalesTimeQuantity) {
          tt.WithinBudget = 1;
        }
        else if(project.SpentTimeQuantity > project.SalesTimeQuantity) {
          tt.WithinBudget = 0;
        }
        else {
          tt.WithinBudget = (project.SalesTimeQuantity - project.SpentTimeQuantity) / tt.Quantity;
        }
        project.SpentTimeQuantity = project.SpentTimeQuantity + tt.Quantity;

        // Check if overspent in HourType

        if(!project.BudgetedHoursPerHourType.length){
          tt.WithinHourBudget = null;
        }
        else{
          const hourBudget = project.BudgetedHoursPerHourType.find(bh => bh.Item == tt.Item);
          if(!hourBudget || hourBudget.Spent > hourBudget.Budget) {
            tt.WithinHourBudget = 0;
          }
          else if(hourBudget.Budget > hourBudget.Spent + tt.Quantity) {
            tt.WithinHourBudget = 1;
          }
          else {
            tt.WithinHourBudget = (hourBudget.Budget - hourBudget.Spent) / tt.Quantity;
          }

          if(hourBudget) hourBudget.Spent = hourBudget.Spent + tt.Quantity;
        }

      });
    });

    /**
     * Save all the data!
     */

    const profileId = req.user.profile.id+'-new';

    console.log({profileId});

    const data = new Data({profileId, TimeTransactions, Employees, Projects, Items});

    await Data.remove({ profileId }).exec();

    await data.save();

    //res.json(data);
    return;










    /**
     * OLD CODE
     */

    // const api = new ExactOnlineAPI(req.user.accessToken, req.user.profile.currentDivision);
    //
    // console.log('Getting all employees..');
    // const employees = await api.getEmployees();
    // console.log(`Recieved ${employees.length} employees.\n`);
    //
    // console.log('Getting time transactions for all employees..');
    // await Promise.all(employees.map(async (employee) => {
    //   employee.timeTransactions = await api.getTimeTransactionsForEmployee(employee.Employee);
    // }));
    // console.log(`Recieved ${employees.reduce((p, e) => p + e.timeTransactions.length, 0)} time transactions.\n`);
    //
    // const projectsToGet = [];
    // employees.forEach(employee => employee.timeTransactions.forEach(timeEntry => {
    //   if (!projectsToGet.includes(timeEntry.Project)) projectsToGet.push(timeEntry.Project);
    // }));
    // console.log(`Getting ${projectsToGet.length} projects..`);
    //
    // const projects = {};
    // await Promise.all(projectsToGet.map(async (project) => {
    //   projects[project] = await api.getProject(project)
    // }));
    //
    // console.log(`Recieved all projects.\n`);
    //
    // console.log('Writing all results to database..');
    //
    // const profileId = req.user.profile.id;
    //
    // const data = new Data({projects, employees, profileId});
    //
    // await Data.remove({ profileId }).exec();
    //
    // await data.save();

  }
  catch (error) {
    console.error(error);
    res.send(error.message);
  }
}
