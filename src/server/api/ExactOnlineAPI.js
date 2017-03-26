import request from 'request-promise';
import oauth from 'simple-oauth2';
import dotenv from 'dotenv';

dotenv.config();
const oauth2 = oauth.create({
  client: {
    id: process.env.EXACT_ONLINE_CLIENT_ID,
    secret: process.env.EXACT_ONLINE_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://start.exactonline.nl',
    tokenPath: '/api/oauth2/token',
    authorizePath: '/api/oauth2/auth'
  },
  options: {
    useBodyAuth: false
  }
});

export default class ExactOnlineAPI {

    constructor(token, currentDivision) {

        this.api = request.defaults(
            {
                baseUrl: 'https://start.exactonline.nl/api/v1',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            }
        );

      this.devisionAPIUrl = 'https://start.exactonline.nl/api/v1/' + currentDivision;
      this.divisionAPI = this.api.defaults({
        baseUrl: this.devisionAPIUrl,
      });

    }

    getEmployees() {
        return this.divisionAPI.get({
            url: '/payroll/ActiveEmployments',
            qs: {
                '$select': 'Employee,EmployeeFullName,ScheduleAverageHours'
            }
        }).then(result => result.d.results);
    }

    async getTimeTransactionsForEmployee(employeeGUID) {
      let next = {
        url: '/project/TimeTransactions',
        qs: {
          // '$top': '100',
          '$filter': 'Employee eq guid\'' + employeeGUID + '\'',
          '$select': 'AccountName,Date,HourStatus,ItemDescription,Notes,Project,ProjectDescription,Quantity,Type'
        }
      };
      const allResults = [];

      while(next) {
        const results = await this.divisionAPI.get(next);
        if(results.d.__next) next = results.d.__next.replace(this.devisionAPIUrl, '');
        else next = false;
        allResults.push(...results.d.results);
      }
      return allResults;
    }

    getProject(projectGUID) {
        return this.divisionAPI.get({
            url: `/project/Projects(guid'${projectGUID}')`
        }).then(result => {return result.d});
    }

}
