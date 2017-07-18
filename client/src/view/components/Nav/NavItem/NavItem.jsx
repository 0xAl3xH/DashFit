import React from 'react';
import {Link} from 'react-router';

export default class NavItem extends React.Component {
  render () {
    return ( 
      <div className = "nav-item" onClick={this.props.onClick}>
        <Link to = {this.props.to} className = "nav-item-link">{this.props.name}</Link>
      </div>
    );
  }
}