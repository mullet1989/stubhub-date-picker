/**
 * Date filter key values.
 */
export const K_TODAY = 'today';
export const K_THIS_WKD = 'this-weekend';
export const K_THIS_MONTH = 'this-month';
export const K_ALL = 'all-dates';
export const K_CHOOSE = 'choose-date';

/**
 * Creates a copy of a Date object with time set to midnight using local time.
 * @param {Date} date A Date object to initialize date value.
 * @return {?Date} A date with time set to midnight.
 */
export const cleanTime = (date) => {
  if (date) {
    const result = new Date(date.valueOf());
    result.setHours(0);
    result.setMinutes(0);
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
  } else {
    return null;
  }
};

/**
 * Formats a date according to specified options. Default representation is
 * "a 3-letter month" followed by "a numeric day of month", eg "Jan 1".
 * @param {Date} date A Date object to initialize date value.
 * @param {string} locale A locale string representing a language or locale tag.
 * @param {Object} options An object that contains one or more properties that
 *     specify formatting options.
 * @return {string} A string with formatted date.
 */
export const formatDate = (date, locale, options) => {
  options = options || {month: 'short', day: 'numeric'};
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString(locale, options);
};

/**
 * Returns a start date based on date filter's key value.
 * @param {Object} dateFilter A date filter object with a 'key' property.
 * @return {?Date} A date representing a start of the period.
 */
const getStartDateFromFilter = (dateFilter) => {
  const date = new Date();
  if (dateFilter && dateFilter.key) {
    switch (dateFilter.key) {
    case K_THIS_WKD:
      // Friday
      date.setDate(date.getDate() + 5 - date.getDay());
      return date;
    case K_TODAY:
    case K_THIS_MONTH:
      // Today
      return date;
    case K_CHOOSE:
      // Picked start date
      return dateFilter.start;
    }
  }
  return null;
};

/**
 * Returns an end date based on date filter's key value.
 * @param {Object} dateFilter A date filter object with a 'key' property.
 * @return {?Date} A date representing an end of the period.
 */
const getEndDateFromFilter = (dateFilter) => {
  const date = new Date();
  if (dateFilter && dateFilter.key) {
    switch (dateFilter.key) {
    case K_TODAY:
      // Tomorrow
      date.setHours(24);
      return date;
    case K_THIS_WKD:
      // Monday
      date.setDate(date.getDate() + 8 - date.getDay());
      return date;
    case K_THIS_MONTH:
      // Next month
      date.setMonth(date.getMonth() + 1);
      date.setDate(1);
      return date;
    case K_CHOOSE:
      // Picked end date
      return dateFilter.end;
    }
  }
  return null;
};

/**
 * Returns date filter's start date with time set to midnight.
 * @param {Object} dateFilter A date filter object with a 'key' property.
 * @return {Date} A start date.
 */
export const getStartDate = (dateFilter) => cleanTime(
  getStartDateFromFilter(dateFilter)
);

/**
 * Returns date filter's end date with time set to midnight.
 * @param {Object} dateFilter A date filter object with a 'key' property.
 * @return {Date} An end date.
 */
export const getEndDate = (dateFilter) => cleanTime(
  getEndDateFromFilter(dateFilter)
);
