import React from 'react';
import './LogWeightWidget.less';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.less';

import MainContent from '../MainContent/MainContent.jsx';
import Title from '../MainContent/Title/Title.jsx';

export default class LogWeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weights: {},
      curDate: moment(),
      rows:[],
      weightRecords:[],
      curWeight: '',
    };
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.submitWeight = this.submitWeight.bind(this);
  }
  
  setNewState(date) {
    this.getWeek(date).then(res =>{
      return res.json();
    }).then(records => {
      this.setState({weightRecords:records});
      var rows = this.renderRows(records);
      this.setState({rows:rows});
      
      var cur_weight = this.getRecordByDate(moment(this.state.curDate)).weight
      this.setState({curWeight: cur_weight ? cur_weight : ""});
    });
  }
  
  handleChangeDate(date) {
    this.setState({
      curDate: date
    });
    this.setNewState(date);
  }
  
  handleChangeInput(e) {
    this.setState({curWeight: e.target.value});
  }
  
  componentDidMount() {
    //Get weight data
    this.setNewState(moment());
  }
  
  average(records) {
    if (!records.length) return null;
    const weightsSum = records.reduce((a, b) => ({weight: a.weight + b.weight})).weight;
    var average = weightsSum/records.length;
    average = (Math.round(average * 10) / 10).toFixed(1);
    return average
  }
  
  getWeek(date) {
    var myHeaders = {
      "Content-Type":'application/json'
    };
    
    return fetch('/weight/query',{
      method:'POST',
      headers: myHeaders,
      body: JSON.stringify({time:date})
    });
  }
  
  renderRows(records) {
  var rows = [];
  for (var i = 0; i < records.length; i++) {
    rows.push(
      <tr key={i}>
        <td>{moment(records[i].time).local().format('M/D')}</td>
        <td>{records[i].weight ? records[i].weight.toFixed(1) : null}</td>
      </tr>);
  }  
  return rows;
  }
  
  getRecordByDate(date) {
    var weight = this.state.weightRecords.filter((record) => date.isSame(record.time,'day'));
    return weight[0] != null ? weight[0] : {weight:null};
  }
  
  submitWeight() {
    var myHeaders = {
      "Content-Type":'application/json'
    };
    
    return fetch('/weight/submit',{
      method:'POST',
      headers: myHeaders,
      body: JSON.stringify({
        time:this.state.curDate,
        weight: this.state.curWeight
      })
    }).then(res =>{
      console.log(res);
      this.setNewState(this.state.curDate);
    });  
  }
  
  render () {
    
    var records = this.state.weightRecords;
    
    return ( 
      <MainContent>
        <Title>Weight Log</Title>
        <div>
          Select a date: <DatePicker selected={this.state.curDate} onChange={this.handleChangeDate}/>
        </div>
        <div>Weekly Average: { this.average(records.filter((record) => "weight" in record)) }</div>
        <table className = "u-full-width weight-table">
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
          Today's weight: <input className="u-full-width" type="text" value={this.state.curWeight} onChange={this.handleChangeInput}/>
          <input className="button-primary" type="submit" value="Submit" onClick={this.submitWeight}/>
        </div>
      </MainContent>
    );
  }
}