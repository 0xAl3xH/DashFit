import React from 'react';
import './HelloWorld.less';

export default class HelloWorld extends React.Component {
  render () {
    return ( 
      <div className = "hello-world-container">
        <p> Hello World!</p>
      </div>
    );
  }
}