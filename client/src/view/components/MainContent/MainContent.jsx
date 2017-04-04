import React from 'react';

export default class MainContent extends React.Component {
  render () {
    return ( 
      <div className = "main-content-container" id={this.props.id}>
        { this.props.children }
      </div>
    );
  }
}