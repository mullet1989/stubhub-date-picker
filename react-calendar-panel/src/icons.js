import React from 'react';

export const rightPointer = ({fill = 'inherit', width = '10px', height = "15px"}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}><path fill={fill} d="M6.3137 7.071L.657 1.4143 2.071 0l5.6568 5.6569L9.1421 7.071l-7.071 7.071L.6569 12.728l5.6568-5.6568z"/></svg>
  );
};

export const leftPointer = ({fill = 'inherit', width = '10px', height = "15px"}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}><path fill={fill} d="M2.8284 7.071l5.6569 5.657L7.071 14.142 1.4142 8.4853 0 7.071 7.071 0l1.4143 1.4142-5.6569 5.6569z"/></svg>
  );
};
