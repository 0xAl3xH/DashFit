import React from 'react';
import './NavItem.less';

export default class NavItem extends React.Component {
  render () {
    return ( 
      <div className = "nav-item">
        { this.props.name }
      </div>
    );
  }
}