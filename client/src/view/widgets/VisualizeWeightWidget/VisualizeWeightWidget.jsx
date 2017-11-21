import React from 'react';
import moment from 'moment';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';

export default class VisualizeWeightWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.weightData = [];
    // Set start of week to Tuesday
    moment.updateLocale('en', {
      week : {
        dow: 2,
      }
    });
  }
  
  componentDidMount() {
    this.updateWeightData();
  }
  
  getWeightData(start,end) {
    return fetch('/weight/query',{
      method:'POST',
      headers: {"Content-Type":'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        start:moment(start).format(), 
        end:moment(end).format()
      })
    });
  }
  
  updateWeightData() {
    const curTime = moment(),
          start = curTime.clone().subtract(30,'months'),
          end = curTime;
    this.getWeightData(start, end).then(res =>{
      return res.json();
    }).then(records =>{
      let sum = 0,
          recordCount = 0,
          count = 0,
          weeks = moment().endOf('year').diff(moment(),'weeks'),
          goalWeight = 165,
          weekStart = moment(),
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
      
      let data = precords.map(datum => {
        // Goal weight 
        datum.time = moment(datum.time);
        datum.goal = goalWeight + 0.75 * weeks;
        
        // Check if data is in the same week
        // note average will be plotted on start of next week with this code
        if (!weekStart.isSame(datum.time.clone().startOf('week'))) {
          if (sum) {
            datum.avg = sum/count;
          }
          weekStart = datum.time.clone().startOf('week');
          sum = 0;
          count = 0;
        }
        
        if (datum.weight) {
          sum += datum.weight;
          count += 1;
        }
        
        datum.time = datum.time.format('M/D');
        return datum;
      });
      this.setState({weightData: data})
    });
  }

  render () {
    console.log(this.state.weightData);
    return ( 
      <MainContent>
        <Title>Visualize Weight</Title>
        <ResponsiveContainer aspect={2} height="auto">
          <LineChart data={this.state.weightData}>
            <Line type="monotone" dataKey="weight" stroke="#8884d8" connectNulls={false} dot={false}/>
            <Line type="monotone" dataKey="avg" stroke="#006000" connectNulls={true}/>
            <Line type="linear" dataKey="goal" stroke="#b21b1b" dot={false} strokeDasharray="20 10"/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="time" />
            <YAxis domain={['dataMin-0.5','dataMax+0.5']} tickCount={10} allowDecimals={false}/>
          </LineChart>
        </ResponsiveContainer>
      </MainContent>
    );
  }
}