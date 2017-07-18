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
    const curTime = moment()
    console.log(curTime);
    this.getWeightData(curTime.clone().subtract(6,'months'), curTime).then(res =>{
      return res.json();
    }).then(data =>{
      let sum = 0,
          recordCount = 0,
          count = 0,
          weeks = moment().endOf('year').diff(moment(),'weeks'),
          goalWeight = 165;
      data = data.map(datum => {
        //goal weight 
        datum.goal = goalWeight + 0.75 * weeks;
        //Take 7 day average
        if (datum.weight) {
          sum += datum.weight;
          recordCount += 1;
        }
        count += 1;
        if (count >= 7) {
          datum.avg = sum/recordCount
          sum = 0;
          recordCount = 0;
          count = 0;
        }
        
        datum.time = moment(datum.time).format('M/D');
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