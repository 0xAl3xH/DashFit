import React from 'react';

export default class Icon extends React.Component {
  render () {
    return ( 
      <div className="icon" onClick={this.props.onClick}>
        <span className={this.props.className}>
        </span> 
      </div>
    );
  }
}