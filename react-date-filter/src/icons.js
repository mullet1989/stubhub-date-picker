import React from 'react';

export const viewCalendar = ({fill = '#5C6570', viewBox = '0 0 16 16', width = '12px', height = '12px'}) => {
  return (
    <svg width={width} height={height} viewBox={viewBox} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <g id="View-Calendar" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path d="M12.3636364,1.42857143 L13.8181818,1.42857143 L16,1.42857143 L16,16 L0,16 L0,1.42857143 L3.63636364,1.42857143 L3.63636364,0 L5.09090909,0 L5.09090909,4.28571429 L3.63636364,4.28571429 L3.63636364,2.85714286 L1.45454545,2.85714286 L1.45454545,6 L14.5454545,6 L14.5454545,2.85714286 L12.3636364,2.85714286 L12.3636364,4.28571429 L10.9090909,4.28571429 L10.9090909,2.85714286 L5.11474609,2.85714286 L5.11474609,1.42857143 L10.9090909,1.42857143 L10.9090909,0 L12.3636364,0 L12.3636364,1.42857143 Z M12.3632812,1.42857143 L12.3632812,2.85714286 L12.3636364,1.42857143 Z" id="calendar" fill={fill}></path>
      </g>
    </svg>
  );
};
