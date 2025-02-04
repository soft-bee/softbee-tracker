import React, { SVGProps } from 'react';
import styled from 'styled-components';

const ArrowUp = (props?: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

const StyledArrowUp = styled(ArrowUp)`
  cursor: pointer;
  fill: #104065;
`;

export default StyledArrowUp;
