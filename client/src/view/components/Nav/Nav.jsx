import React from 'react';
import NavItem from './NavItem/NavItem'

export default class Nav extends React.Component {
  render () {
    return ( 
      <div className = {"nav-container" + " " + 
          this.props.className} 
        style={ (this.props.show? {height:this.props.expandHeight} : {})}>
        <NavItem to = "/weight" name = "Log Weight" onClick={this.props.hideNav}/>
        <NavItem to = "/visualize" name = "Visualize" onClick={this.props.hideNav}/>
      </div>
    );
  }
}