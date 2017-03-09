import React from 'react';
import './NavItem.less';
import {Link} from 'react-router';

export default class NavItem extends React.Component {
  render () {
    return ( 
      <div className = "nav-item">
        <Link to = {this.props.to} className = "nav-item-link">{this.props.name}</Link>
      </div>
    );
  }
}