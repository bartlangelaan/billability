import React from 'react';
import { refreshData } from '../data';
import { Form, Text } from 'react-form';

const TimeExceptionsForm = ({ exceptions, employee }) => {
  const ex = exceptions.slice();
  ex.push({});

  return (

    <Form
      onSubmit={values => fetch('api/data/timeExceptions', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exceptions: values.ex,
          employee,
        }),
      }).then(refreshData)}
      defaultValues={{ ex }}
      onChange={({ values }) => values.ex[values.ex.length - 1].quantity && values.ex.push({})}
    >
      {({ submitForm, values }) => {
        return (
          <form onSubmit={submitForm}>
            <table>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>

                {values.ex.map((e, i) => (<tr key={i}>
                  <td><Text field={['ex', i, 'from']} /></td>
                  <td><Text field={['ex', i, 'to']} /></td>
                  <td><Text field={['ex', i, 'quantity']} type="number" placeholder="0" /></td>
                </tr>))}
              </tbody>
            </table>
            <button type="submit">Submit</button>
          </form>
      );
      }}
    </Form>
  );
};

export default TimeExceptionsForm;
