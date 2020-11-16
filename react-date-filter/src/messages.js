import {defineMessages} from 'react-intl';

export default defineMessages({
  'choose-date': {
    id: "DateFilter.ChooseDate",
    defaultMessage: "Choose Date",
    description: "DateFilter: Click to select date range"
  },
  'today': {
    id: "DateFilter.Today",
    defaultMessage: "Today"
  },
  'this-weekend': {
    id: "DateFilter.ThisWeekend",
    defaultMessage: "This Weekend"
  },
  'this-month': {
    id: "DateFilter.ThisMonth",
    defaultMessage: "This Month"
  },
  'all-dates': {
    id: "DateFilter.AllDates",
    defaultMessage: "All dates"
  },
  'when': {
    id: "DateFilter.When",
    defaultMessage: "When"
  }
});

export const altMessages = defineMessages({
  'choose-date': {
    id: "DateFilter.AltChooseDate",
    defaultMessage: "Custom dates",
    description: "AltDateFilter: Click to select date range"
  },
  'today': {
    id: "DateFilter.AltToday",
    defaultMessage: "Today"
  },
  'this-weekend': {
    id: "DateFilter.AltThisWeekend",
    defaultMessage: "This weekend"
  },
  'this-month': {
    id: "DateFilter.AltThisMonth",
    defaultMessage: "This month"
  },
  'all-dates': {
    id: "DateFilter.AltAllDates",
    defaultMessage: "All dates"
  },
  'when': {
    id: "DateFilter.AltWhen",
    defaultMessage: "Select Dates"
  }
});
