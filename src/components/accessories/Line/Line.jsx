import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {
  extractStyles,
  staticStyleTypes
} from '../../../utils/styles';
import {
  eventTypes,
  extractEvents
} from '../../../utils/events';


const Line = (props, context) => {
  const { data } = props;
  const { containerWidth, containerHeight } = context;
  const styles = extractStyles(props);
  const events = extractEvents(props);
  const xScale = props.xScale || context.xScale;
  const yScale = props.yScale || context.yScale;

  xScale.rangeRound([0, containerWidth]);
  yScale.rangeRound([containerHeight, 0]);

  const line = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));

  return (
    <g>
      <path
        {...styles}
        {...events}
        d={line(data)}
      />
    </g>
  );
};

Line.propTypes = {
  ...staticStyleTypes,
  ...eventTypes,
  data: PropTypes.array.isRequired,
  xScale: PropTypes.func,
  yScale: PropTypes.func
};

Line.defaultProps = {
  fill: 'none',
  stroke: '#000'
};

Line.contextTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  containerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Line;
