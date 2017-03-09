import React from 'react';
import './nav.less';

export default class Nav extends React.Component {
  render () {
    return ( 
      <div className = "nav-container">
        { this.props.children }
      </div>
    );
  }
}