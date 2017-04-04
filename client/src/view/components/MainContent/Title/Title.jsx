import React from 'react';

export default class Title extends React.Component {
  render () {
    return ( 
      <div className = "main-content-title">
        <h3 className = "main-content-title-text">{ this.props.children }</h3>
      </div>
    );
  }
}