//TODO: Look into webpack aliasing for relative imports to avoid ../../../........hell
import React from 'react';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

export default class VisualizeWeightWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    
    const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: null, pv: null, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];
    
    return ( 
      <MainContent>
        <Title>Visualize Weight</Title>
        <ResponsiveContainer aspect={2} height="auto">
          <LineChart data={data}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" connectNulls={false}/>
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
          </LineChart>
        </ResponsiveContainer>
      </MainContent>
    );
  }
}