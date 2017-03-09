import React from 'react';
import {render} from 'react-dom';

import HelloWorld from './components/Test/HelloWorld.jsx';
import Nav from './components/Nav/Nav.jsx';

//Use skeleton boilerplate
import './shared_styles/skeleton.less'

class App extends React.Component {
  render () {
    return (
      <Nav>
        <HelloWorld/>
        <HelloWorld/>
      </Nav>
    );
  }
}

render(<App/>, document.getElementById('app'));