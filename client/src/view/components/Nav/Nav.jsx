import React from 'react';

export default class Nav extends React.Component {
  render () {
    return ( 
      <div className = "nav-container">
        { this.props.children }
      </div>
    );
  }
}