import React from 'react';
import PropTypes from 'prop-types';
import {FormattedDate} from 'react-intl';
import '../styles/calendar-cell.scss';

class CalendarCell extends React.Component {
  static propTypes = {
    date: PropTypes.instanceOf(Date)
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      fromDate: new Date(Date.now()).setHours(0, 0, 0, 0),
      highlight: false
    };
  }

  pickDate = () => {
    this.props.pickDate(this.props.date, this.props.selectionType);
  }

  render() {
    let today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    let todayDate;
    let {date, validDate, changeColorstart, changeColorend, highlight, changeColor} = this.props;
    if (date && today) {
      todayDate = (date.valueOf() === today.valueOf()) ? true : false;
    }
    /**
     * Dates Section
     **/
    let dateSection = (date) ? <FormattedDate value={date} day='numeric'/> : null;

    return (
      <div>
        <div className="CalendarDateCard__OuterContainer">
          <div className={ `${ (changeColorstart) ? 'CalendarDateCard__Container--Starthighlight' : (changeColorend) ? 'CalendarDateCard__Container--Endhighlight' : 'CalendarDateCard__Container'}`}>
            {dateSection && (
              <div className={`CalendarDateCard__Date ${!validDate ? 'CalendarDateCard__Date--Disable' : ''} ${ todayDate ? 'CalendarDateCard__Datehover' : ''} ${ highlight ? 'CalendarDateCard__Datehighlight' : ''} ${ (changeColorend || changeColorstart || changeColor) ? 'CalendarDateCard__Dateactive' : ''}`} onClick={this.pickDate}>
                {dateSection}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

CalendarCell.propTypes = {
  validDate: PropTypes.any,
  toDate: PropTypes.any,
  changeColorstart: PropTypes.any,
  changeColorend: PropTypes.any,
  highlight: PropTypes.any
};

export default CalendarCell;
