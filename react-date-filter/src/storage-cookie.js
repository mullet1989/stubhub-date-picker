/**
 * TODO: Extract cookies manipulation into a separate component. Combine
 * 'date filter' and 'location' cookies into one component as user's
 * preferences.
 */

const USER_INFO_COOKIE_NAME = process.env.REACT_APP_USER_INFO_COOKIE_NAME;
const DATE_COOKIE_FIELD_NAME = 'date';
const isFunction = (functionInstance) => typeof functionInstance === 'function';

/**
 * Cookies manipulation functions.
 */
const getCookieTTL = () => {
  let cookieTTLDate = new Date();
  cookieTTLDate.setTime(cookieTTLDate.getTime() + 21600000);
  return cookieTTLDate;
};

const getUserInfoFromRequestCookies = (cookies) => {
  return cookies && isFunction(cookies.getJSON)
    && cookies.getJSON(USER_INFO_COOKIE_NAME)
    || {};
};

export const getUserSelectedDate = (cookies) => {
  const userInfo = getUserInfoFromRequestCookies(cookies);
  return userInfo && userInfo[DATE_COOKIE_FIELD_NAME];
};

const setUserInfoInRequestCookies = (cookies, userInfo) => {
  if (cookies && isFunction(cookies.setJSON)) {
    cookies.setJSON(USER_INFO_COOKIE_NAME, userInfo, {expires: getCookieTTL()});
  }
};

export const storeUserSelectedDate = (cookies, dateFilter) => {
  if (cookies && dateFilter) {
    const userInfo = getUserInfoFromRequestCookies(cookies);
    userInfo[DATE_COOKIE_FIELD_NAME] = dateFilter;
    setUserInfoInRequestCookies(cookies, userInfo);
  }
};
