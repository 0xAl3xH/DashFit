import React from 'react';
import MainContent from 'components/MainContent/MainContent';

export default class SquareLoader extends React.Component {
  render () {
    return (
      <div className ="loader-container" style={{"height": window.innerHeight}}>
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
      </div>
    );
  }
}