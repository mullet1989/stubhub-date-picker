import {Controller} from '@stubhub/react-store-provider';
import {NAMESPACE, dateFilterSelector} from './selectors';
import {storeUserSelectedDate} from './storage-cookie';

/**
 * Stores active date filter selection into cookies and dispatches a reducer
 * to update props.
 * @param {Object} dateFilter Date filter selected item.
 */
function onSelection(dateFilter) {
  return (dispatch, getState, {cookies}) => {
    storeUserSelectedDate(cookies, dateFilter);
    dispatch({type: 'USER_DATE_FILTER_CHANGED', date: dateFilter});
  };
}

/**
 * A DateFilter component's controller.
 */
const controller = new Controller({
  namespace: NAMESPACE,
  mapStateToProps: function (state) {
    return {
      dateFilter: dateFilterSelector(state)
    };
  },
  actionCreators: {
    onSelection
  },
  reducers: ['USER_DATE_FILTER_CHANGED']
});

export default controller;
