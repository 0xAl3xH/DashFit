import React from 'react';
import './LogWeightWidget.less';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.less';

import MainContent from '../MainContent/MainContent.jsx';
import Title from '../MainContent/Title/Title.jsx';

export default class LogWeight extends React.Component {
  constructor() {
    super();
    this.state = {
      average: undefined,
      weights: {
      },
      curDate: moment(),
      rows:[]
    };
  }
  
  handleChange(date) {
    this.setState({
      curDate: date
    });
  }
  
  componentDidMount() {
    //Get weight data
    this.getWeek().then(res =>{
      return res.json();
    }).then(records => {
      this.setState({average: this.calcAverage(records)});
      var rows = this.renderRows(records);
      this.setState({rows:rows});
    });
  }
  
  calcAverage(records) {
    const weightsSum = records.reduce((a, b) => ({weight: a.weight + b.weight})).weight;
    var average = weightsSum/records.length;
    average = (Math.round(average * 10) / 10).toFixed(1);
    return average
  }
  
  getWeek(date) {
    var myHeaders = {
      "Content-Type":'application/json'
    };
    
    return fetch('/weight',{
      method: 'GET',
      headers: myHeaders,
    });
  }
  
  renderRows(records) {
  var rows = [];
  for (var i = 0; i < records.length; i++) {
    rows.push(
      <tr key={i}>
        <td>{moment(records[i].time).format('M/D')}</td>
        <td>{records[i].weight.toFixed(1)}</td>
      </tr>);
  }  
  return rows;
  }
  
  render () {
    const weights = this.state.weights;
    return ( 
      <MainContent>
        <Title>Weight Log</Title>
        <div>
          Select a date: <DatePicker
        selected={this.state.curDate}
        onChange={this.handleChange.bind(this)}/>
        </div>
        <div>Weekly Average: { this.state.average }</div>
        <table  className = "u-full-width weight-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {this.state.rows}
          </tbody>
        </table>
        <div className = "three columns">
          Today's weight: <input className="u-full-width" type="text"/>
          <input className="button-primary" type="submit" value="Submit"/>
        </div>
      </MainContent>
    );
  }
}