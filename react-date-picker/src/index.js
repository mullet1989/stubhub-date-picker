import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import CalendarPanel from '@stubhub/react-calendar-panel';
import Backdrop from '@stubhub/react-backdrop';
import Draggable from '@stubhub/react-draggable';
import '../styles/index.scss';
import LegacyCache from '@stubhub/legacy-cache';
import {FormattedMessage, intlShape, injectIntl} from 'react-intl';

export const DATE_FILTER = 'date-filter';

const formatDate = (selecteddate, globalRegistry) => {
  let currentLocale = globalRegistry.getCurrentLocale();
  var date = new Date(selecteddate);
  let options = {month: 'short', day: 'numeric', year: 'numeric'};
  return date.toLocaleDateString(currentLocale, options);
};
const windowWidth = __CLIENT__ ? window.innerWidth : 600;
const isSmall = (windowWidth < 640);

class DatePicker extends React.Component {
  constructor() {
    super(...arguments);
    let {from, to, useBackdrop = true} = this.props;

    // Initialize legacy cache
    this.legacyCache = new LegacyCache({
      type: 'session',
      namespace: DATE_FILTER
    });

    this.state = {
      from: from,
      to: to,
      selectionType: 'from',
      prevSelectedfromDate: '',
      showBackdrop: useBackdrop && isSmall
    };
  }

  handleChangeTo = () => {
    this.switchSelection('to');
  };

  handleChangeFrom = () => {
    this.switchSelection('from');
  };

  selectedDate = (date) => {
    this.setState({
      date: date
    });
    let {from, to, selectionType} = this.state;
    let prevSelectedDate = this.legacyCache.get('dateFilterCacheSettings');
    let prevSelectedtoDate;
    let prevSelectedfromDate;

    if (prevSelectedDate) {
      prevSelectedfromDate = new Date(prevSelectedDate.eventStartDate);
      prevSelectedtoDate = new Date(prevSelectedDate.eventEndDate);
    }
    if (selectionType === 'from') {
      from = date;
      if (prevSelectedtoDate && (from < prevSelectedtoDate)) {
        to = prevSelectedtoDate;
      }
      if (to === undefined) {
        selectionType = 'to';
      }
    } else {
      this.setState({from, to, selectionType});
      to = date;
      if ((from === undefined) && prevSelectedfromDate) {
        from = prevSelectedfromDate;
      } else if (from === undefined) {
        from = new Date(Date.now());
      }
    }

    if (from && to) {
      var dateFilterSettings = {
        prefDate: 'custom_date_range',
        eventStartDate: from,
        eventEndDate: to,
        allDates: false,
        isDateSelected: true
      };
      this.legacyCache.unlockNamespace();
      this.legacyCache.set('dateFilterCacheSettings', dateFilterSettings);
      this.props.onSelection(from, to);
    }
    this.setState({from, to, selectionType});

  }

  switchSelection = (type) => {
    this.setState({selectionType: type});
  }
  /**
   * Method to handle document click which hides items when click outside current dropdownlist.
   * @param e [object] The Synthetic React event object generated for the 'onKeydown' event listener.
   */
  handleDocumentClick = (e) => {
    if (this.rootNode && !this.rootNode.contains(e.target)) {
      this.setState({showBackdrop: false});
      e.focusout = true;
      this.props.onClose && this.props.onClose(e);
    }
  };

  onStop = (e) => {
    e.slideDownOut && this.setState({showBackdrop: false});
    this.handleDocumentClick(e);
  };

  move = (e) => {
  };

  // Don't use draggable if viewport is not small
  useDraggable = (draggable) => {
    return (draggable && isSmall);
  }

  /**
   * React Component Lifecycle Methods.
   **/
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  render() {
    let {draggable = false, useBackdrop = true} = this.props;
    draggable = this.useDraggable(draggable);
    let {x, y} = this.state;
    let backdrop = (
      (useBackdrop && isSmall) ? <Backdrop show={this.state.showBackdrop} clicked={this.handleDocumentClick} /> : null
    );

    return (
      <div className={cs("DatePicker__DPC1", {Draggable: draggable})}>
        {backdrop}
        <div className="DatePicker__DPC2">
          { (draggable) ?
            <Draggable x={x} y={y} onMove={this.move} onStop={this.onStop}>
              {this.inRender()}
            </Draggable> :
            <div className="draggablePlaceHolder">
              {this.inRender()}
            </div>
          }
        </div>
      </div>
    );
  }

  inRender() {
    let {from, to, selectionType} = this.state;
    let selectedYear;
    let selectedMonth;
    let date = new Date(Date.now());
    let dateAvailable = this.legacyCache.get('dateFilterCacheSettings');
    let draggable = this.useDraggable(this.props.draggable);

    if (!from && !to && dateAvailable) {
      from = dateAvailable.eventStartDate;
      to = dateAvailable.eventEndDate;
    }
    if (from != undefined && to === undefined && selectionType === 'to') {
      selectedMonth = new Date(from).getMonth();
      selectedYear = new Date(from).getFullYear();
    } else if (selectionType === 'from' && dateAvailable) {
      selectedMonth = new Date(dateAvailable.eventStartDate).getMonth();
      selectedYear = new Date(dateAvailable.eventStartDate).getFullYear();
    } else if (selectionType === 'to' && dateAvailable) {
      selectedMonth = new Date(dateAvailable.eventEndDate).getMonth();
      selectedYear = new Date(dateAvailable.eventEndDate).getFullYear();
    } else {
      selectedMonth = new Date(from).getMonth() || date.getMonth();
      selectedYear = new Date(from).getFullYear() || date.getFullYear();
    }

    return (<div className={cs("date-range-picker", {Draggable: draggable})} ref={(node) => this.rootNode = node}>
      {draggable ? <div className="drp-dragbar" onClick={this.props.onClose}> </div> : null}
      <div className="drp-header">
        <div className="drp-header-text">
          <FormattedMessage id="DatePicker.header" defaultMessage="Select date range" description="Calendar Header"/>
        </div>
        <div className="sh-iconset-container" onClick={this.props.onClose}>
          {draggable ? null : <div className="sh-iconset sh-iconset-close close-options"></div>}
        </div>
      </div>
      <div className="drp-from-to">
        <div className={`tab from-tab ${selectionType === 'from' ? 'current-tab' : ''}`} onClick={this.handleChangeFrom}>
          <div className="tab-title">
            <FormattedMessage id="DatePicker.from" defaultMessage="From" description="From Date"/>
          </div>
          <div className="tab-text">{from ? formatDate(from, this.context.globalRegistry) : ''}</div>
        </div>
        <div className={`tab to-tab ${selectionType === 'to' ? 'current-tab' : ''}`} onClick={this.handleChangeTo}>
          <div className="tab-title">
            <FormattedMessage id="DatePicker.to" defaultMessage="To" description="To Date"/>
          </div>
          <div className="tab-text">{to ? formatDate(to, this.context.globalRegistry) : ''}</div>
        </div>
      </div>

      <div className="DatePicker__MainContent">
        {
          <CalendarPanel {...this.props} from={this.state.from} onselectDate={this.selectedDate} selectedMonth={selectedMonth} selectedYear={selectedYear} selectionType={selectionType}/>
        }
      </div>
    </div>);
  }
}

DatePicker.propTypes = {
  intl: intlShape.isRequired,
  onClose: PropTypes.func
};

DatePicker.contextTypes = {
  globalRegistry: PropTypes.object,
  onClose: () => void 0
};

export default (injectIntl(DatePicker));
