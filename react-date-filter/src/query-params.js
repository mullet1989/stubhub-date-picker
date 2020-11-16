import {
  K_ALL, K_CHOOSE, K_THIS_MONTH, K_THIS_WKD, K_TODAY,
  cleanTime,
  getStartDate,
  getEndDate
} from './utils';

import DateTimeFormat from './datetimeformat';

export const qualifiedDate = (param) => {
  const type = param.charAt(0), range = param.slice(1);
  let key = K_ALL, start, end;
  let tokens = range.match(/([0-9]{4}(-[0-9]{1,2}){2})to([0-9]{4}(-[0-9]{1,2}){2})/);

  if (tokens && tokens.length === 5) {
    let tzOff = (new Date).getUTCHours() - (new Date).getHours();
    tzOff = (tzOff < 0) ? tzOff + 24 : tzOff;
    start = new Date(`${tokens[1]}T${tzOff < 10 ? '0' : ''}${tzOff}:00:00Z`);
    end = new Date((new Date(`${tokens[3]}T${tzOff < 10 ? '0' : ''}${tzOff}:00:00Z`)).setHours(24) - 1);
    let bodToday = cleanTime(new Date());
    let eodToday = cleanTime(new Date()).setHours(24);
    // If the date range already expired, let's use 'All dates'
    if (+end <= bodToday) {
      return {key};
    }
    let bodWeekend = getStartDate({key: K_THIS_WKD});
    let eodWeekend = getEndDate({key: K_THIS_WKD});
    let bodMonth = getStartDate({key: K_THIS_MONTH});
    let eodMonth = getEndDate({key: K_THIS_MONTH});
    if (+start === +bodMonth && +end + 1 === +eodMonth ||
      type === 'm' && +end + 1 === +eodMonth) {
      key = K_THIS_MONTH;
    } else if (+start === +bodWeekend && +end + 1 === +eodWeekend ||
      type === 'w' && +end + 1 === +eodWeekend) {
      key = K_THIS_WKD;
    } else if (+start === +bodToday && +end + 1 === +eodToday ||
      type === 't' && +end + 1 === +eodToday) {
      key = K_TODAY;
    } else {
      return {key: K_CHOOSE, start, end};
    }
  }
  return {key};
};

export const dateParam = (dateTime) => {
  if (!dateTime || dateTime.key === K_ALL || !dateTime.start || !dateTime.end) {
    return 'a';
  }
  const {key} = dateTime;
  let type = (key === K_TODAY) ? 't' : (key === K_THIS_WKD) ? 'w' :
    (key === K_THIS_MONTH) ? 'm' : (key === K_CHOOSE) ? 'c' : 'a';
  let end = new Date(+cleanTime(dateTime.end) - 1);
  return `${type}${DateTimeFormat.toAPIString(dateTime.start, '')}to${DateTimeFormat.toAPIString(end, '')}`;
};

