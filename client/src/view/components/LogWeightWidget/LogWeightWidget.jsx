import React from 'react';
import './LogWeightWidget.less';

import MainContent from '../MainContent/MainContent.jsx';
import Title from '../MainContent/Title/Title.jsx';

export default class LogWeight extends React.Component {
  constructor() {
    super();
    this.state = {
      average: null,
      weights: {
      }
    };
  }
  
  componentDidMount() {
    //Get weight data
    this.setState({
      weights: {
        Monday:176.0,
        Tuesday:175.4,
        Wednesday:175.4,
        Thursday:174.9        
      }
    });
  }
  
  calcAverage(weights) {
    const weightsSum = Object.values(weights).reduce((a,b) => a + b, 0);
    var average = weightsSum/Object.keys(weights).length;
    average = (Math.round(average * 10) / 10).toFixed(1);
    if (weights) 
      return average
    return null
  }
  
  render () {
    const weights = this.state.weights;
    const average = this.state.average ? this.state.average: this.calcAverage(weights);
    var rows = [];
    for (var i = 0; i < Object.keys(weights).length; i++) {
      var day = Object.keys(weights)[i];
      rows.push(
        <tr key={i}>
          <td>{day}</td>
          <td>{weights[day].toFixed(1)}</td>
        </tr>);
    }
    return ( 
      <MainContent>
        <Title>Weight Log</Title>
        <div>Current Weekly Average: { average }</div>
        <table className = "u-full-width">
          <thead>
            <tr>
              <th>Day</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </table>
      </MainContent>
    );
  }
}