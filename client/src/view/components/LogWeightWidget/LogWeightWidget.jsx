import React from 'react';
import './LogWeightWidget.less';

import MainContent from '../MainContent/MainContent.jsx';
import Title from '../MainContent/Title/Title.jsx';

export default class LogWeight extends React.Component {
  render () {
    return ( 
      <MainContent>
        <Title>WeightLog</Title>
      </MainContent>
    );
  }
}