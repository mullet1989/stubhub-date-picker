/* globals dayjs, dayjs_plugin_localeData */

import DayPicker from "react-day-picker";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { loadScript } from "./useScript";
import { appContext } from "./AppContext";
import { DateUtils } from "react-day-picker";

// override the styled here
const StyledDatePicker = styled(DayPicker)`
  .DayPicker-Day {
    height: 30px;
    width: 30px;
  }

  .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    color: #5c6570;
    background: rgba(26, 199, 199, 0.15);
    opacity: 1;
  }

  .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    background: #00b5b5;
  }

  .DayPicker-Day {
    border-radius: 0 !important;
  }

  .DayPicker-Day--start {
    opacity: 1;
    background-color: #00b5b5;
    border-radius: 20px;
    font-weight: 700;
    color: #fff;
  }
  .DayPicker-Day--end {
    opacity: 1;
    background-color: #00b5b5;
    border-radius: 20px;
    font-weight: 700;
    color: #fff;
  }

  .DayPicker-Day--today {
    color: unset;
    font-weight: unset;
  }
`;

const DatePickerComponent = (props) => {
  const [load, setLoad] = useState(false);
  const [range, setRange] = useState({
    from: null,
    to: null,
  });

  const localeData = useRef(null);

  useEffect(() => {
    const start = async () => {
      // todo : we can host this ourselves probably
      await loadScript("https://unpkg.com/dayjs@1.8.21/dayjs.min.js");
      await loadScript(
        "https://unpkg.com/dayjs@1.9.6/locale/" + props.locale + ".js"
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

  const handleDayClick = (day, { selected }) => {
    const r = DateUtils.addDayToRange(new Date(day), range);
    setRange((_r) => r);
  };

  const { from, to } = range;
  const modifiers = { start: from, end: to };

  return (
    load && (
      <div
        style={{ display: "flex", flexDirection: "column", margin: "0 20px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={{ padding: "10px" }}>
            date from
            <br />
            {from && from.toLocaleDateString()}
          </div>
          <div style={{ padding: "10px" }}>
            date to
            <br />
            {to && to.toLocaleDateString()}
          </div>
        </div>

        <StyledDatePicker
          locale={appContext.locale}
          dir={appContext.isRightToLeft ? "rtl" : "ltr"}
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          onDayClick={handleDayClick}
          months={localeData.current.months()}
          weekdaysLong={localeData.current.weekdays()}
          weekdaysShort={localeData.current.weekdaysShort()}
          firstDayOfWeek={localeData.current.firstDayOfWeek()}
          fromMonth={new Date()}
        />
      </div>
    )
  );
};

export default DatePickerComponent;
