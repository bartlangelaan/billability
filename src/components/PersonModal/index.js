import React, { Component } from 'react';
import Modal from 'react-modal';
import TimeExceptoinsForm from './TimeExceptionsForm';
import store from '../data';

export default class extends Component {

  render() {
    const person = this.props.person.data;
    return (
      <Modal
        isOpen
        onRequestClose={this.props.onRequestClose}
      >
        <h2>{person.EmployeeFullName}</h2>
        <h3>Hours a week exceptions</h3>
        <TimeExceptoinsForm exceptions={store.timeExceptions.filter(ex => ex.employee === person.ID)} employee={person.ID} />
      </Modal>
    );
  }

}
