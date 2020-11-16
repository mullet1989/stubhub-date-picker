import React from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';

import DatePicker from '@stubhub/react-date-picker';
import DropdownList from '@stubhub/react-dropdown-list';
import {omni_track, omniture} from '@stubhub/react-omniture-provider';
import {connect} from '@stubhub/react-store-provider';
import withQueryParams from '@stubhub/react-with-query-params';

import controller from './controller';
import {viewCalendar} from './icons';
import {altMessages} from './messages';

import {
  K_ALL, K_CHOOSE, K_THIS_MONTH, K_THIS_WKD, K_TODAY,
  formatDate,
  getStartDate,
  getEndDate
} from './utils';

import {
  dateFilterEndSelector,
  dateFilterKeySelector,
  dateFilterSelector,
  dateFilterStartSelector
} from './selectors';

import {qualifiedDate, dateParam} from './query-params';

import '../styles/index.scss';

@withQueryParams({pbD: 'pbD'})
@omniture({appInteractionType: 'NE: Date Range', appInteraction: 'NE: Date Range'})
class DateFilter extends React.Component {

  static contextTypes = {
    globalRegistry: PropTypes.object,
    track: PropTypes.object
  };

  static propTypes = {
    dateFilter: PropTypes.object,
    inPillBar: PropTypes.bool,
    intl: intlShape.isRequired,
    onClick: PropTypes.func,
    useQueryParams: PropTypes.bool,
    replaceQuery: PropTypes.func.isRequired,
    onSelection: PropTypes.func.isRequired
  };

  static defaultProps = {
    dateFilter: {},
    inPillBar: false,
    useQueryParams: true,
    onClick: () => void 0
  };

  constructor(props, context) {
    super(...arguments);
    let {intl, useAltMsgs, selected = K_ALL} = props;
    let itemList;
    let messages = altMessages; // all instances of react-date-filter should have the default value of 'Select Dates'
    this.defaultItemText = intl.formatMessage(messages[selected]);
    if (context.globalRegistry.getFeatureValue('homepage.enableDatePicker') === true) {
      itemList = (useAltMsgs) ?
        [K_ALL, K_TODAY, K_THIS_WKD, K_THIS_MONTH, K_CHOOSE] :
        [K_CHOOSE, K_TODAY, K_THIS_WKD, K_THIS_MONTH, K_ALL];
    } else {
      itemList = [K_TODAY, K_THIS_WKD, K_THIS_MONTH, K_ALL];
    }

    this.dateFilterItems = itemList.map((key) => {
      return {key, name: intl.formatMessage(messages[key])};
    });

    const queryParamsToggle = context.globalRegistry.getFeatureValue('common.queryParams');
    const {useQueryParams, query: options = {}} = props;

    this.useQueryParams = queryParamsToggle && useQueryParams;
    if (this.useQueryParams && options.pbD) {
      this.dateSelection(qualifiedDate(options.pbD));
    }

    this.state = {
      showDatePicker: false
    };
  }

  @omni_track(false)
  trackDateSection(item) {
    const {track} = this.context;
    let {name} = item;
    let {appInteraction, siteSections} = this.props.omniPage();
    let trackingObj = {
      siteSections, // prop 1
      appInteractionType: 'NE: Date Range',
      tntRecipeAndCampaignName: name, // prop 18
      appInteraction: `NE: Date Range: Value Selected: ${name}` // prop 61
    };
    if (track) {
      track.click(trackingObj.appInteractionType, trackingObj);
    }

    return trackingObj;
  }

  @omni_track(false)
  trackDropdown(e, eventName) {
    const {track} = this.context;
    let {appInteraction, siteSections} = this.props.omniPage();
    let trackingObj = {appInteractionType: 'NE: Date Range'};
    if (eventName === 'expand') {
      trackingObj = {
        ...trackingObj,
        siteSections, // prop 1
        appInteraction: 'NE: Date Range: Date Filter Opened' // prop 61
      };
    } else if (eventName === 'focusout') {
      trackingObj = {
        ...trackingObj,
        siteSections, // prop 1
        appInteraction: 'NE: Date Range: Date Filter Focus Out' // prop 61
      };
    } else if (eventName === 'close') {
      trackingObj = {
        ...trackingObj,
        siteSections, // prop 1
        appInteraction: 'NE: Date Range: Date Filter Closed' // prop 61
      };
    }
    if (track) {
      track.click(trackingObj.appInteractionType, trackingObj);
    }

    return trackingObj;
  }

  onDropDownExpand = (e) => {
    this.trackDropdown(e, 'expand');
  }

  onDropDownClose = (e) => {
    if (e.focusout) {
      this.trackDropdown(e, 'focusout');
    } else {
      this.trackDropdown(e, 'close');
    }
  }

  @omni_track(false)
  trackDatePickerClose(e) {
    // track for date picker close
    const {track} = this.context;
    let {siteSections, appInteraction} = this.props.omniPage();
    let trackingObj = {appInteractionType: 'NE: Date Range'};
    if (!e.focusout) {
      trackingObj = {
        ...trackingObj,
        siteSections, // prop 1
        appInteraction: `NE: Calendar Picker: Close button` // prop 61
      };
    } else if (e.focusout) {
      // When date picker focus out, set the v61 as date filter focus out as requested by PM
      trackingObj = {
        ...trackingObj,
        siteSections, // prop 1
        appInteraction: `${this.trackingValues.appInteraction}: Date Filter Focus Out` // prop 61
      };
    }
    if (track) {
      track.click(trackingObj.appInteractionType, trackingObj);
    }

    return trackingObj;
  }

  getItemByKey = (key) => {
    var findResult = this.dateFilterItems.filter((item) => item.key === key);
    return (findResult.length > 0) ? findResult[0] : null;
  }

  dateSelection = ({key, name, start, end}) => {
    end && end.setHours(24);
    const selProps = {key, name, start, end};
    this.props.onSelection(selProps);
    return selProps;
  }

  onSelection = (item) => {
    if (!item) {
      return this.onReset();
    }
    let key = item.key;
    if (key !== K_CHOOSE || this.state.showDatePicker) {
      this.setState({item: item});
    }
    let promise;

    this.trackDateSection(item);

    switch (key) {
    case K_CHOOSE:
      if (!this.state.showDatePicker) {
        promise = new Promise((resolve) => {
          this.setState({showDatePicker: true});
          this.pickDateDeferred = resolve;
        });
        promise.then(({key, name, start, end}) => {
          let item = this.getItemByKey(K_CHOOSE);
          const selProps = this.dateSelection({key: K_CHOOSE, name: item && item.name, start, end});
          this.onDateSelection(selProps);
          this.setState({item, showDatePicker: false});
        });
      }
      return promise;
    default:
      this.onDateSelection({key});
      return this.props.onSelection({key});
    }
  }

  onDateSelection = (dateTime) => {
    const {replaceQuery} = this.props;
    if (dateTime) {
      if (dateTime.key !== K_CHOOSE) {
        dateTime.start = getStartDate(dateTime);
        dateTime.end = getEndDate(dateTime);
      }
      this.useQueryParams && replaceQuery({pbD: dateParam(dateTime)});
    }
  };

  onReset = () => {
    this.setState({item: undefined});
  }

  pickDate = (from, to) => {
    if (this.pickDateDeferred) {
      let item = this.dateFilterItems[0];
      this.pickDateDeferred({...item, start: from, end: to});
      this.start = from;
      this.end = to;
    }
  }

  parseSelectionDisplay = ({key, name, start, end}) => {
    start = this.start;
    end = this.end;

    if (key === K_CHOOSE && start && end) {
      const locale = this.context.globalRegistry
        && this.context.globalRegistry.getCurrentLocale();
      end = new Date(end);
      end.setDate(end.getDate() - 1);
      return formatDate(start, locale) + ' - ' + formatDate(end, locale);
    } else {
      return name;
    }
  }

  onDatePickerClose = (...args) => {
    this.setState({
      showDatePicker: false
    });
    this.trackDatePickerClose(...args);
  }

  onClick = (e) => {
    this.props.onClick(e);
  }

  render() {
    const {dateFilter, draggable = false, inPillBar, useBackdrop = false} = this.props;
    const iconCls = inPillBar ? "DateFilter__iconCalendar" : "sh-iconset-calendar";
    const icon = inPillBar ? viewCalendar : null;
    let selected = null;
    let selectedName = null;

    /**
     * A dateFilter object is stored in cookies. Middleware reads its value
     * into initial state. Then DateFilter controller passes this object
     * to initiate dateFilter in props.
     */
    if (dateFilter && dateFilter.key) {
      selected = this.getItemByKey(dateFilter.key);
      if (dateFilter.key === K_CHOOSE) {
        this.start = dateFilter.start;
        this.end = dateFilter.end;
        selectedName = this.parseSelectionDisplay(selected);
      }
    }
    if (!selected) {
      selected = this.defaultItemText || this.dateFilterItems[0];
    }
    selectedName = selectedName || selected.name;

    return (
      <div className={cs('sec-date-filter', this.props.className)}>
        <DropdownList
          className="date-filter"
          selectionTitle={selectedName}
          selected={selected}
          items={this.dateFilterItems}
          onSelection={this.onSelection}
          parseSelectionDisplay={this.parseSelectionDisplay}
          onClick={this.onClick}
          useCheckMark={true}
          dropDownToggle={this.props.dropDownToggle}
          inPillBar={inPillBar}
          draggable={draggable}
          useBackdrop={useBackdrop}
          iconCls={iconCls}
          icon={icon}
          iconColor={this.props.iconColor}
          onExpand={this.onDropDownExpand}
          onClose={this.onDropDownClose}/>

        {this.state.showDatePicker ?
          <DatePicker
            onSelection={(from, to) => this.pickDate(from, to)}
            onClose={this.onDatePickerClose}
            from={this.state.startdate} to={this.state.enddate}
            draggable={draggable}
            useBackdrop={useBackdrop}
            onClick={this.onClick}/> :
          null
        }
      </div>
    );
  }
}

export default connect(controller)(injectIntl(DateFilter));

export const selectors = {
  dateFilter: dateFilterSelector,
  endDate: dateFilterEndSelector,
  key: dateFilterKeySelector,
  startDate: dateFilterStartSelector
};

export const keys = {
  K_ALL,
  K_CHOOSE,
  K_THIS_MONTH,
  K_THIS_WKD,
  K_TODAY
};

export const utils = {
  formatDate
};

export {default as messages} from './messages';
