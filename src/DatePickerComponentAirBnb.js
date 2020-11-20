import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DayPickerRangeController from "react-dates";


const DatePickerComponent = (props) => {
  const [load, setLoad] = useState(false);

  const localeData = useRef(null);

  useEffect(() => {

  }, [props.locale]);


  return (
    load && (
      <DayPickerRangeController
        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
        onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        initialVisibleMonth={null} // PropTypes.func or null,
      />
    )
  );
};

export default DatePickerComponent;
