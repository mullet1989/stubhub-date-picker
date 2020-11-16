import {createSelector} from 'reselect';
import {getStartDate, getEndDate} from './utils';

/**
 * A namespace for date filter selectors.
 */
export const NAMESPACE = 'user';

/**
 * Gets local state based on a namespace.
 * @param {Object} state A state containing a namespace.
 * @return {Object} A local state.
 */
const getLocalState = (state = {}) => state[NAMESPACE];

/**
 * Selects a date filter object from the state.
 * @param {Object} state A state containing a namespace.
 * @return {Object} A local state.
 */
const getDateFilter = createSelector(
  getLocalState,
  (localState = {}) => localState.date
);

/**
 * Selects a date filter object from the state. Updates start and end dates
 * based on filter's key value.
 * @param {Object} state A state containing a namespace with date filter in it.
 * @return {Object} A date filter with key, start and stop properties.
 */
export const dateFilterSelector = createSelector(
  createSelector(getDateFilter, (dateFilter = {}) => dateFilter.key),
  createSelector(getDateFilter, (dateFilter = {}) => dateFilter.name),
  createSelector(getDateFilter, (dateFilter = {}) => getStartDate(dateFilter)),
  createSelector(getDateFilter, (dateFilter = {}) => getEndDate(dateFilter)),
  (key, name, start, end) => {
    return {key, name, start, end};
  }
);

/**
 * Selects a key from the state.
 * @param {Object} state A state containing a namespace with date filter in it.
 * @return {Date} A key representing a date selection.
 */
export const dateFilterKeySelector = createSelector(
  dateFilterSelector,
  (dateFilter) => dateFilter && dateFilter.key
);

/**
 * Selects a start date from the state.
 * @param {Object} state A state containing a namespace with date filter in it.
 * @return {Date} A start date.
 */
export const dateFilterStartSelector = createSelector(
  dateFilterSelector,
  (dateFilter) => dateFilter && dateFilter.start
);

/**
 * Selects an end date from the state.
 * @param {Object} state A state containing a namespace with date filter in it.
 * @return {Date} An end date.
 */
export const dateFilterEndSelector = createSelector(
  dateFilterSelector,
  (dateFilter) => dateFilter && dateFilter.end
);
