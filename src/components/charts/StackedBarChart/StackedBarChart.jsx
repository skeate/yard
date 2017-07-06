import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {
  applyStyles2Selection,
  extractStyles,
  dynamicStyleTypes
} from '../../../utils/styles';
import {
  eventTypes,
  extractEvents,
  applyEvents2Selection
} from '../../../utils/events';


export default class StackedBarChart extends React.Component {
  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update() {
    const { data, x, keys } = this.props;
    const { containerWidth, containerHeight } = this.context;
    const $chart = d3.select(this.$chart);
    const xScale = this.props.xScale || this.context.xScale;
    const yScale = this.props.yScale || this.context.yScale;

    xScale.rangeRound([0, containerWidth]);
    yScale.rangeRound([containerHeight, 0]);

    // add/update/remove Series
    const serieUpdate = $chart.selectAll('.serie')
      .data(d3.stack().keys(keys)(data));
    // const serieEnter = serieUpdate.enter();
    // const serieExit = serieUpdate.exit();

    // serieEnter
    //   .append('g')
    //   .attr('class', 'serie');

    // serieExit
    //   .remove();

    // d3.stack().keys(keys)(data).forEach(s => {
    //   $chart.select('g.serie')
    // });

    // add/update/remove Bars
    const barUpdate = serieUpdate // .merge(serieUpdate.enter())
      .selectAll('.bar')
      .data((serie) => {
        // attach serie key to each bar
        serie.forEach((d) => { d.key = serie.key; });
        return serie;
      });
    const barEnter = barUpdate.enter();
    const barExit = barUpdate.exit();

    barEnter
      .append('rect')
      .attr('class', 'bar')
    .merge(barUpdate)
      .attr('x', d => xScale(x(d.data)))
      .attr('y', d => yScale(d[1]) || 0) // TODO - filter out bars w/ no height/y, i.e. those added to a serie that don't have corresponding data
      .attr('width', xScale.bandwidth())
      .attr('height', d => yScale(d[0]) - yScale(d[1]) || 0);

    barExit
      .remove();

    const bars = $chart.selectAll('.bar');
    applyStyles2Selection(extractStyles(this.props), bars);
    applyEvents2Selection(extractEvents(this.props), bars);
  }

  render() {
    const { children, keys } = this.props;

    return (
      <g
        ref={(el) => { this.$chart = el; }}
      >
        {keys.map(key => (
          <g
            className="serie"
            key={key}
          />
        ))}

        { children }
      </g>
    );
  }
}

StackedBarChart.propTypes = {
  ...dynamicStyleTypes,
  ...eventTypes,
  data: PropTypes.array.isRequired,
  keys: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  x: PropTypes.func
};

StackedBarChart.defaultProps = {
  x: d => d.key
};

StackedBarChart.contextTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  containerWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
