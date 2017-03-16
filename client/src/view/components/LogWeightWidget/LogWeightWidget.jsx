//TODO: Look into webpack aliasing for relative imports to avoid ../../../........hell
import React from 'react';
import './LogWeightWidget.less';
import moment from 'moment';
import MainContent from '../MainContent/MainContent.jsx';
import Title from '../MainContent/Title/Title.jsx';
import WeightForm from './WeightForm/WeightForm.jsx';

export default class LogWeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment(),
      weightRecords:[],
      curWeight: '',
    };
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.submitWeight = this.submitWeight.bind(this);
  }
  
  getWeek(date) {
  const myHeaders = {
    "Content-Type":'application/json'
  };
  return fetch('/weight/query',{
    method:'POST',
    headers: myHeaders,
    body: JSON.stringify({time:date})
  });
  }
  
  setNewState(date) {
    this.getWeek(date).then(res =>{
      return res.json();
    }).then(records => {
      this.setState({weightRecords:records});
      const cur_weight = this.getRecordByDate(moment(this.state.selectedDate)).weight
      this.setState({curWeight: cur_weight ? cur_weight : ""});
    });
  }
  
  handleChangeDate(date) {
    this.setState({
      selectedDate: date
    });
    this.setNewState(date);
  }
  
  handleChangeInput(e) {
    this.setState({curWeight: e.target.value});
  }
  
  componentDidMount() {
    //Get weight data
    this.setNewState(this.state.selectedDate);
  }
  
  average(records) {
    if (!records.length) return null;
    const weightsSum = records.reduce((a, b) => ({weight: a.weight + b.weight})).weight;
    let average = weightsSum/records.length;
    average = (Math.round(average * 10) / 10).toFixed(1);
    return average
  }
  
  renderRows(records) {
  const rows = [];
  for (let i = 0; i < records.length; i++) {
    rows.push(
      <tr key={i}>
        <td>{moment(records[i].time).local().format('M/D')}</td>
        <td>{records[i].weight ? records[i].weight.toFixed(1) : null}</td>
      </tr>);
  }  
  return rows;
  }
  
  getRecordByDate(date) {
    const weight = this.state.weightRecords.filter((record) => date.isSame(record.time,'day'));
    return weight[0] != null ? weight[0] : {weight:null};
  }
  
  submitWeight() {
    const myHeaders = {
      "Content-Type":'application/json'
    };
    
    return fetch('/weight/submit',{
      method:'POST',
      headers: myHeaders,
      body: JSON.stringify({
        time:this.state.selectedDate,
        weight: this.state.curWeight
      })
    }).then(res =>{
      console.log(res);
      this.setNewState(this.state.selectedDate);
    });  
  }
  
  render () {
    
    const records = this.state.weightRecords;
    
    return ( 
      <MainContent>
        <Title>Weight Log</Title>
        <WeightForm selectedDate={this.state.selectedDate} onDateSelect={this.handleChangeDate} inputWeight={this.state.curWeight} onInput={this.handleChangeInput} onSubmit={this.submitWeight}/>
        <div>Weekly Average: { this.average(records.filter((record) => "weight" in record)) }</div>
        <table className = "u-full-width weight-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows(records)}
          </tbody>
        </table>
      </MainContent>
    );
  }
}