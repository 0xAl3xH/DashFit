import React from 'react';
import './Header.less';

/**
* Header meant to take a title within the bounding tags
* if the title given is a link, it will be styled such 
* that there is no text decoration and color change 
* upon hover.
**/

export default class Header extends React.Component {
  render () {
    return ( 
      <div className = "header">
        <div className = "header-title"> { this.props.children } </div>
      </div>
    );
  }
}