import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import WeightForm from './WeightForm/WeightForm';
/**
* Widget which facilitates taking client inputs for weight information 
* and submits it to the sever. Additionally, it also gets corresponding
* weight data from the server when the client requests it. All of the 
* AJAX calls for logging weight should be made here.
*
* Displays weight for the week of the selected day. A week in this 
* context is defined as Tuesday to Monday.
**/
export default class LogWeight extends React.Component {
  constructor(props) {
    super(props);
    
    // Set start of week to Tuesday
    moment.updateLocale('en', {
      week : {
        dow: 2,
      }
    });
    
    this.state = {
      selectedDate: moment(),
      weightRecords:[],
      curWeight: '',
    };
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.submitWeight = this.submitWeight.bind(this);
  }
  
  /**
  * Given a date of the week, return an array
  * containing the [startDate, endDate] of the
  * week as defined by the locale
  * @param date a Moment instance
  */

  getWeekBounds(date) {
    let start = date.clone().startOf('week'),
        end = start.clone().endOf('week');
    return [start, end];
  }
  
  /**
  * @param date a Date or Moment object
  * Fetches the weekly weight data from the server given the 
  * date. 
  **/
  getWeek(date) {
    
    const myHeaders = {
      "Content-Type":'application/json'
    },
    bound = this.getWeekBounds(date);
    
    return fetch('/weight/query',{
      method:'POST',
      headers: myHeaders,
      credentials: 'include',
      body: JSON.stringify({
        start:moment(bound[0]).format(), 
        end:moment(bound[1]).format()
      })
    });
  }
  
  /**
  * @param date a Date or Moment object
  * Gets the weekly weight data then updates the corresponding state
  **/
  setNewState(date) {
    this.getWeek(date).then(res =>{
      return res.json();
    }).then(records => {
      
      let bound = this.getWeekBounds(date),
          start = moment(bound[0]),
          end = moment(bound[1]),
          numDays = end.clone().diff(start.clone(),'days') + 1;
      
      const recordsMap = {};
      records.map(function(record) {
        recordsMap[moment(record.time).format('M-D-Y')] = [record.weight, record._id, record.time];
      });
      const startDay = start.clone();
      let precords = []
      
      // populate empty days 
      for (var i = 0; i < numDays; i++) {
        let date = startDay.clone().add(i, "d"),
            day = date.format('M-D-Y');
        if (day in recordsMap) {
          precords.push({
            id: recordsMap[day][1],
            time: recordsMap[day][2],
            weight: recordsMap[day][0]
          });
        } else {
          precords.push({
            time: date,
          });
        }
      }
      
      this.setState({weightRecords:precords});
      let record = this.getRecordByDate(moment(this.state.selectedDate));
      const cur_weight = record ? record.weight : null;
      this.setState({curWeight: cur_weight ? cur_weight : ""});
    });
  }
  
  handleChangeDate(date) {
    this.setState({
      selectedDate: date,
      curWeight: ''
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
  
  /**
  * @param records an array of weight records
  * Returns the average of the array of weight records,
  * if there are no items in the array, returns null
  **/
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
          <td>{moment(records[i].time).format('M/D')}</td>
          <td>{records[i].weight ? records[i].weight.toFixed(1) : null}</td>
        </tr>);
    }  
    return rows;
  }
  
  /**
  * @param date a Date or Moment object
  * Given a date, find a record currently stored in widget state 
  * that matches returns undefined if not found.
  **/ 
  getRecordByDate(date) {
    const weight = this.state.weightRecords.filter((record) => {return date.isSame(record.time, 'day')});
    return weight.pop();
  }
  
  submitWeight() {
    const myHeaders = {
      "Content-Type":'application/json'
    };
    
    return fetch('/weight/submit',{
      method:'POST',
      headers: myHeaders,
      credentials: 'include',
      body: JSON.stringify({
        time:this.state.selectedDate.format(),
        weight: this.state.curWeight
      })
    }).then(res =>{
      this.setNewState(this.state.selectedDate);
    });  
  }
  
  render () {
    
    const records = this.state.weightRecords;
    const todayRecord = this.getRecordByDate(moment(this.state.selectedDate));
    return ( 
      <MainContent>
        <Title>Weight Log</Title>
        <WeightForm selectedDate={this.state.selectedDate} onDateSelect={this.handleChangeDate} inputWeight={this.state.curWeight} onInput={this.handleChangeInput} hasRecord={todayRecord ? todayRecord.weight : todayRecord} onSubmit={this.submitWeight}/>
        <div className = "u-center-container">Weekly Average: {this.average(records.filter((record) => "weight" in record))}</div>
        <div className = "eight columns u-center-container">
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
        </div>
      </MainContent>
    );
  }
}