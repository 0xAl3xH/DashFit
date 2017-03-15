import React from 'react';
import './Header.less';

/**
* Header meant to take a title within the bounding tags
* if the title given is a link, it will be styled such 
* that there is no text decoration and color change 
* upon hover.
**/

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.headerOffsetHandler = this.headerOffsetHandler.bind(this);
  }
  
  getHeight() {
    return this.refs.header.clientHeight;
  }
  
  headerOffsetHandler(initial) { 
    this.setState({height:this.getHeight()});
    this.props.headerOffsetFunc(this.getHeight());
  }
  
  componentDidMount() {
    this.headerOffsetHandler(); 
    window.addEventListener("resize", this.headerOffsetHandler);
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.headerOffsetHandler);
  }
  
  render () {
    return ( 
      <div className= "header" ref="header">
        <div className = "header-title">{this.props.children}</div>
      </div>
    );
  }
}
