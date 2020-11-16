import React from 'react';
import {FormattedDate} from "react-intl";
const getWeekDayRow = (weekIndex, weekdayIndex, content = null, className) => <div key={`calendar-weekday-row-${weekIndex}-${weekdayIndex}`} className={`${className}`}>{content}</div>;
/**
 * Method to Compute the Calendar State given a month and year
 * @param selectedYear [number] The Year in the format [YYYY] for which Calendar state is to be calculated.
 * @param selectedMonth [number] The month index starting from 0 for which Calendar state is to be calculated.
 * @return calendarState [object] The Computed State of the Calendar for the `selectedYear` and `selectedMonth`.
 * @return calendarState.selectedYear [number] The year passed as the input.
 * @return calendarState.selectedMonth [number] The month passed as the input.
 * @return calendarState.numberOfDaysInCurrentMonth [number] The number of days in the selected month.
 * @return calendarState.firsDayOfCurrentMonth [number] The index repressing the first day of the current month.
 * @return calendarState.lastDayOfWeekForPreviousMonth [number] The index repressing the last day of the previous month.
 **/
export const computeCalendarState = ({selectedYear, selectedMonth}) => {
  let currentMonthDateObj = getCurrentMonthDateObj({selectedMonth, selectedYear});
  let numberOfDaysInCurrentMonth = currentMonthDateObj && currentMonthDateObj.getDate();
  let previousMonthDateObj = getPreviousMonthDateObj({selectedMonth, selectedYear});
  let lastDayOfWeekForPreviousMonth = previousMonthDateObj && previousMonthDateObj.getDay();
  let firsDayOfCurrentMonth = (lastDayOfWeekForPreviousMonth + 1) % 7;

  return {
    selectedYear,
    selectedMonth,
    numberOfDaysInCurrentMonth,
    firsDayOfCurrentMonth,
    lastDayOfWeekForPreviousMonth
  };
};

/**
 * Method to get Current Month Date object.
 * @param selectedYear [number] The Year in the format [YYYY] for which Calendar state is to be calculated.
 * @param selectedMonth [number] The month index starting from 0 for which Calendar state is to be calculated.
 * @return currentMonthDateObj [Date] The javascript Date object for the current month.
 **/
const getCurrentMonthDateObj = ({selectedMonth, selectedYear}) => {
  if (selectedMonth >= 0 && selectedYear) {
    return new Date(selectedYear, selectedMonth + 1, 0);
  }
};

/**
 * Method to get Previous Month Date object.
 * @param selectedYear [number] The Year in the format [YYYY] for which Calendar state is to be calculated.
 * @param selectedMonth [number] The month index starting from 0 for which Calendar state is to be calculated.
 * @return previousMonthDateObj [Date] The javascript Date object for the current month.
 **/
const getPreviousMonthDateObj = ({selectedMonth, selectedYear}) => {
  if (selectedMonth >= 0 && selectedYear) {
    return new Date(selectedYear, selectedMonth, 0);
  }
};

/**
 * Method to Initialize Current Date with User Selections for month and year for the calendar.
 * @param props [object={}] The Object containing the current selection of month and year if selected by the user.
 * @param props.selectedYear [number] The Year in the format [YYYY] for which Calendar state is to be calculated.
 * @param props.selectedMonth [number] The month index starting from 0 for which Calendar state is to be calculated.
 * @return calendarState [object] The Computed State of the Calendar for the `selectedYear` and `selectedMonth`.
 * @return calendarState.currentDate [Date] The current date instance of javascript Date Object.
 * @return calendarState.selectedYear [number] The year passed as the input.
 * @return calendarState.selectedMonth [number] The month passed as the input.
 **/
export const initializeCurrentDate = (props = {}) => {
  let currentDate = new Date(Date.now());
  let selectedMonth = (props.selectedMonth >= 0) ? props.selectedMonth : currentDate.getMonth();
  let selectedYear = props.selectedYear || currentDate.getFullYear();

  return {
    currentDate,
    selectedMonth,
    selectedYear
  };
};

/**
 * Generate the Days of the Week using the Fixed Date which starts with Sunday
 * Note: `weekStartDay` is the offset used to start the calendar week from a day other than sunday
 * @param weekStartDay The Index of the Day of the Week to Start the Calendar Week From (i.e. 0 = Sunday, 1 = Monday) based as locale requirement.
 * @return weekdayLabels [array] The array containing the Week Day names as the value with javascript weekday index from the Date Object as the index (starting with 0).
 **/
export const getWeekDayNames = (weekStartDay = 0) => {
  let startDate = 11 + weekStartDay;
  let month = 1;
  let year = 2018;

  let weekdayNames = [];
  for (let i = startDate, lastDayOfWeek = i + 6; i <= lastDayOfWeek; i++) {
    weekdayNames.push(<FormattedDate value={new Date(year, month, startDate++)} weekday='short'/>);
  }

  return weekdayNames;
};

export const getDaysOfWeekRow = (calendarWeekClassname, weekdayLabels) => {
  let calendarWeekdayRow = [];

  for (let i = 0, weekdayLabelsLen = weekdayLabels.length; i < weekdayLabelsLen; i++) {
    let label = weekdayLabels[i];
    calendarWeekdayRow.push(<div key={`${i}-${label}`} className="CalendarPanel__CalendarDay--label">{label}</div>);
  }

  return <div className={calendarWeekClassname}>{calendarWeekdayRow}</div>;
};

export const setCalendarState = (dateFilterOptions) => {
  let {
    selectedYear,
    selectedMonth,
    numberOfDaysInCurrentMonth,
    firsDayOfCurrentMonth,
    lastDayOfWeekForPreviousMonth
  } = computeCalendarState({...dateFilterOptions});

  return {
    selectedYear,
    selectedMonth,
    numberOfDaysInCurrentMonth,
    firsDayOfCurrentMonth,
    lastDayOfWeekForPreviousMonth
  };
};

export const monthSelection = (selectedYear, selectedMonth, direction) => {
  if (direction === 'Back') {

    selectedMonth--;
    /**
     * The Month is Negative number, decrement the year and set the month to last month of the year.
     **/
    if (selectedMonth < 0) {
      selectedMonth = 11;
      selectedYear--;
    }
  } else {
    selectedMonth++;
    /**
     * The Month is greater than 11, increment the year and set the month to first month of the year.
     **/
    if (selectedMonth > 11) {
      selectedMonth = 0;
      selectedYear++;
    }

  }
  return {
    selectedYear,
    selectedMonth
  };

};

export const calendar = (weekStartDay, numberOfDaysInCurrentMonth, lastDayOfWeekForPreviousMonth, firsDayOfCurrentMonth, selectedYear, selectedMonth, blankCalendarDateCard, calendarWeekClassName, className, buildCalendarCell, scope) => {
  let numberOfWeeksInCurrentMonth = Math.ceil((lastDayOfWeekForPreviousMonth + numberOfDaysInCurrentMonth) / 7);
  let currentDay = 1;
  let calendarWeekRow = [];

  for (let weekIndex = 0; weekIndex <= numberOfWeeksInCurrentMonth; weekIndex++) {
    let calendarWeekdayRow = [];

    for (let weekdayIndex = weekStartDay, lastDayOfWeek = weekStartDay + 6; weekdayIndex <= lastDayOfWeek; weekdayIndex++) {
      /**
       * If First Week on the Month and the `weekdayIndex` is less than `firsDayOfCurrentMonth
       * i.e. Spilled Dates from previous month, Add Blank Cell for Spilled Dates from previous month.
       **/
      if (weekIndex === 0 && weekdayIndex < firsDayOfCurrentMonth) {
        calendarWeekdayRow.push(getWeekDayRow(weekIndex, weekdayIndex, blankCalendarDateCard, className));
      } else if (currentDay <= numberOfDaysInCurrentMonth && (weekIndex > 0 || weekdayIndex >= firsDayOfCurrentMonth)) {
        let eventCalendarCardComponent = buildCalendarCell.call(scope, currentDay, selectedYear, selectedMonth);

        calendarWeekdayRow.push(getWeekDayRow(weekIndex, weekdayIndex, eventCalendarCardComponent, className));
        currentDay++;
      } else {
        /**
         * Add Blank Cell for Spilled Dates from the next month.
         **/
        calendarWeekdayRow.push(getWeekDayRow(weekIndex, weekdayIndex, blankCalendarDateCard, className));
      }
    }
    /**
     * Group the Weekday Rows in to a Week Row.
     **/
    calendarWeekRow.push(<div key={`calendar-week-row-${weekIndex}`} className={calendarWeekClassName}>{calendarWeekdayRow}</div>);
    /**
     * if the Current Day is greater than max number of the days in the month then break the loop.
     **/
    if (currentDay > numberOfDaysInCurrentMonth) {
      break;
    }
  }
  return calendarWeekRow;

};

/**
 * Method to get the Month Names Translation in an Array indexed by the Month Number from the Date Object.
 * @return monthNames [array] The array containing the month names as the value with javascript month number from the Date Object as the index (starting with 0).
 **/
export const getMonthNames = () =>{
  let month = 0;
  let monthNames = [];

  for (let i = 0; i < 12; i++) {
    monthNames.push(<FormattedDate value={new Date(2018, month++, 1)} month='long'/>);
  }

  return monthNames;
};
