import React from 'react';
import './Header.less';

export default class Header extends React.Component {
  render () {
    return ( 
      <div className = "header">
        <div className = "header-title"> { this.props.children } </div>
      </div>
    );
  }
}