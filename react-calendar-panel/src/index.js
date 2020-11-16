import React from 'react';
import PropTypes from 'prop-types';
import {FormattedDate} from "react-intl";
import CalendarCell from './calendar-cell';
import {rightPointer, leftPointer} from './icons';
import LegacyCache from '@stubhub/legacy-cache';
import {omni_track, omniture} from '@stubhub/react-omniture-provider';
import {computeCalendarState, initializeCurrentDate, getWeekDayNames, getDaysOfWeekRow, setCalendarState, monthSelection, calendar} from '@stubhub/react-calendar-helper';

import '../styles/calendar-panel.scss';

const CALENDAR_WEEK_CLASSNAME = 'CalendarPanel__CalendarWeek';
const CALENDAR_NAV_DIRECTION_FORWARD = 'Forward';
const CALENDAR_NAV_DIRECTION_BACK = 'Back';
export const DATE_FILTER = 'date-filter';
@omniture({})

class CalendarPanel extends React.Component {

  static propTypes = {
    weekStartDay: PropTypes.number.isRequired,
    lastValidDate: PropTypes.string,
    isBirth: PropTypes.bool
  };

  static defaultProps = {
    weekStartDay: 0,
    lastValidDate: null,
    isBirth: false
  };

  static contextTypes = {
    track: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    let {weekStartDay} = props;

    this.legacyCache = new LegacyCache({
      type: 'session',
      namespace: DATE_FILTER
    });

    /**
     * Generate the Days of the Week using the Fixed Date which starts with Sunday
     * Note: `weekStartDay` is the offset used to start the calendar week from a day other than sunday
     **/
    let weekdayLabels = getWeekDayNames(weekStartDay);

    /**
     * Initialize the Dates and Derive Calendar State.
     * NOTE (IMPORTANT) - To Maintain Current Selected Month and Year Selection Context only when the performer is the same and switching between tabs
     **/
    let initializeDate = initializeCurrentDate(props);
    let initialCalendarState = computeCalendarState(initializeDate);

    /**
     * Set the Initial State of the Component.
     **/
    this.state = {
      weekStartDay,
      weekdayLabels,
      ...initialCalendarState
    };
  }

  componentWillReceiveProps(nextProps) {
    let selectedYear = nextProps.selectedYear;
    let selectedMonth = nextProps.selectedMonth;
    let selectionType = nextProps.selectionType;
    this.setState({
      selectedYear,
      selectedMonth,
      selectionType
    });
  }

  pickDate = (date, selectionType) => {
    if (selectionType === undefined) {
      selectionType = "from";
    }
    this.trackClickedDate(date, selectionType);
    this.props.onselectDate && this.props.onselectDate(date);
  }

  @omni_track(false)
  trackClickedDate(date, selectionType) {
    const {track} = this.context;
    let formatdate = ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
    const trackingValues = {
      appInteractionType: `NE: Date Range`,
      appInteraction: `NE: Calendar Picker: ${selectionType}: ${formatdate}`
    };
    if (track) {
      track.click(trackingValues.appInteractionType, trackingValues);
    }

    return trackingValues;
  }

  buildCalendarCell(currentDay, selectedYear, selectedMonth) {
    const {lastValidDate} = this.props;
    let selectionType = this.state.selectionType;
    let dateAvailable = this.legacyCache.get('dateFilterCacheSettings');
    let prevFromDate;
    let todayDate = new Date(Date.now());
    todayDate.setHours(0, 0, 0, 0);
    let prevToDate;
    if (dateAvailable) {
      prevFromDate = dateAvailable.eventStartDate;
      prevToDate = dateAvailable.eventEndDate;
    }

    /**
     * If Day is in Range of current month then add Event Calendar Cards for those Dates.
    **/

    let currentDate = new Date(selectedYear, selectedMonth, currentDay);

    let changeColorstart;
    let changeColorend;
    let highlight;
    let changeColor;

    let validDate = (currentDate < todayDate) ? false : true;

    if (prevFromDate) {
      changeColorstart = ((currentDate.valueOf() == new Date(prevFromDate).valueOf())) ? true : false;
      if ((currentDate.valueOf() < new Date(prevFromDate).valueOf()) && (currentDate < todayDate) && (selectionType === "from")) {
        validDate = false;
      } else if ((currentDate.valueOf() < new Date(prevFromDate).valueOf()) && selectionType === "to") {
        validDate = false;
      } else {
        validDate = (currentDate < todayDate) ? false : true;
      }
    }

    if(lastValidDate && (currentDate.valueOf() > new Date(lastValidDate).valueOf())) {
      validDate = false;
    }

    if (prevToDate) {
      changeColorend = ((currentDate.valueOf() == new Date(prevToDate).valueOf())) ? true : false;
    }

    if (prevFromDate && prevToDate) {
      highlight = (((currentDate) > new Date(prevFromDate)) && ((currentDate) < new Date(prevToDate))) ? true : false;
    }


    if (this.props.from) {
      let from = new Date(this.props.from);
      if ((currentDate.valueOf() < from.valueOf()) && selectionType != "from") {
        changeColorend = false;
        changeColorstart = false;
        highlight = false;
        validDate = false;
      }

      if (currentDate.valueOf() === from.valueOf()) {
        changeColor = true;
      } else {
        changeColor = false;
      }
    }

    let calendarDate = new Date(selectedYear, selectedMonth, currentDay);
    let eventCardParams = {
      date: calendarDate,
      validDate: this.props.isBirth ? !validDate : validDate,
      changeColorstart: changeColorstart,
      changeColorend: changeColorend,
      highlight: highlight,
      changeColor: changeColor,
      selectionType: selectionType

    };

    let eventCalendarCardComponent = (<CalendarCell {...eventCardParams} onselectDate={this.props.onselectDate} pickDate={this.pickDate}/>);
    return eventCalendarCardComponent;
  }

  buildEventCalendar() {
    /**
     * Number Of Weeks in the Current Month is equal to sum of
     * a) Number of Days in Previous month which spillover from previous month to first weekIndex.
     * b) Number of Days in Current Month.
     **/

    let blankCalendarDateCard = <CalendarCell onselectDate={this.props.onselectDate}/>;

    let {weekStartDay, numberOfDaysInCurrentMonth, lastDayOfWeekForPreviousMonth, firsDayOfCurrentMonth, selectedYear, selectedMonth} = this.state;
    let className = "CalendarPanel__CalendarDay";
    let calendarWeekRow = calendar(weekStartDay, numberOfDaysInCurrentMonth, lastDayOfWeekForPreviousMonth, firsDayOfCurrentMonth, selectedYear, selectedMonth, blankCalendarDateCard, CALENDAR_WEEK_CLASSNAME, className, this.buildCalendarCell, this);

    return calendarWeekRow;
  }

  handleMonthSelection(direction) {
    let {selectedYear, selectedMonth} = this.state;
    let selection = monthSelection(selectedYear, selectedMonth, direction);
    selectedYear = selection.selectedYear;
    selectedMonth = selection.selectedMonth;

    /**
     * Update the State with the new Selection.
     **/

    let {
      numberOfDaysInCurrentMonth,
      firsDayOfCurrentMonth,
      lastDayOfWeekForPreviousMonth
    } = setCalendarState({selectedYear, selectedMonth});
    this.setState({selectedYear,
      selectedMonth,
      numberOfDaysInCurrentMonth,
      firsDayOfCurrentMonth,
      lastDayOfWeekForPreviousMonth});
  }

  previousMonth = (e) => {
    e.preventDefault();
    this.handleMonthSelection(CALENDAR_NAV_DIRECTION_BACK);
  }

  nextMonth = (e) => {
    e.preventDefault();
    this.handleMonthSelection(CALENDAR_NAV_DIRECTION_FORWARD);
  }

  render() {
    let {selectedYear, selectedMonth, weekdayLabels} = this.state;
    let currentSelectedDateObj = new Date(selectedYear, selectedMonth);
    let weekdayLabelRow = getDaysOfWeekRow(CALENDAR_WEEK_CLASSNAME, weekdayLabels);
    let calendarWeekRow = this.buildEventCalendar();

    let previousMonth;
    let currentDate = new Date(selectedYear, (selectedMonth + 1), 1);
    let date = new Date(Date.now());
    let todayDate = new Date(date.getFullYear(), (date.getMonth() + 1), 1);
    previousMonth = (todayDate < currentDate);

    const {isBirth} = this.props;

    return (
      <div className="CalendarPanel__CalendarContainer">
        <div className="CalendarPanel__CalendarHeader">
          <div className="CalendarPanel__SelectedMonthYear">
            <span className="CalendarPanel__SelectedMonth"><FormattedDate value={currentSelectedDateObj} month='long'/></span>
            <span className="CalendarPanel__SelectedYear"> <FormattedDate value={currentSelectedDateObj} year='numeric'/></span>
          </div>
          <div className="CalendarPanel__ButtonContainer">
            <button className={`CalendarPanel__PreviousMonthButton ${(!previousMonth && !isBirth) ? 'CalendarPanel__PreviousMonthButton--Disable' : ''}`} onClick={this.previousMonth}>{leftPointer({})}</button>
            <button className="CalendarPanel__NextMonthButton" onClick={this.nextMonth}>{rightPointer({})}</button>
          </div>
        </div>
        <div className="CalendarPanel__CalendarMonth">
          {weekdayLabelRow}
          {calendarWeekRow}
        </div>
      </div>
    );
  }
}

export default CalendarPanel;
