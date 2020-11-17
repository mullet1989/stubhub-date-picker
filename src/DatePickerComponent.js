/* globals dayjs, dayjs_plugin_localeData */

import DayPicker from "react-day-picker";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { loadScript } from "./useScript";
import { appContext } from "./AppContext";


// override the styled here
const StyledDatePicker = styled(DayPicker)`
  .DayPicker-Caption {
    color: red;
  }
`;

const DatePickerComponent = (props) => {
  const [load, setLoad] = useState(false);

  const localeData = useRef(null);

  useEffect(() => {
    const start = async () => {
      // todo : we can host this ourselves probably
      await loadScript("https://unpkg.com/dayjs@1.8.21/dayjs.min.js");
      await loadScript(
        "https://unpkg.com/dayjs@1.9.6/locale/" + props.locale + ".js",
      );
      await loadScript("https://unpkg.com/dayjs@1.9.6/plugin/localeData.js");

      // set the locale - global
      dayjs.locale(props.locale);
      dayjs.extend(dayjs_plugin_localeData);

      localeData.current = dayjs().localeData();

      setLoad(true);
    };

    start();
  }, [props.locale]);

  return (
    load && (
      <StyledDatePicker
        locale={appContext.locale}
        dir={appContext.isRightToLeft ? "rtl" : "ltr"}
        months={localeData.current.months()}
        weekdaysLong={localeData.current.weekdays()}
        weekdaysShort={localeData.current.weekdaysShort()}
        firstDayOfWeek={localeData.current.firstDayOfWeek()}
        fromMonth={new Date()}
      />
    )
  );
};

export default DatePickerComponent;
