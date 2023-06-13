import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MyDatePicker = ({ selectedDate, onChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      showTimeInput
      timeInputLabel="Time:"
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
    />
  );
};

export default MyDatePicker;