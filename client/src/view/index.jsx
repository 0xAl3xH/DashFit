import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router';

// Import React components
import HelloWorld from './components/Test/HelloWorld.jsx';
import Header from './components/Header/Header.jsx';
import Nav from './components/Nav/Nav.jsx';
import NavItem from './components/Nav/NavItem/NavItem.jsx';
import MainContent from './components/MainContent/MainContent.jsx';

// Use Skeleton styling boilerplate
import './shared_styles/skeleton.less'

const Visualize = () => (
  <h2>Visualize</h2>
);

const LogWeight = () => (
  <h2>Weight Log</h2>
);

class App extends React.Component {
  render () {
    return (
      <div>
        <Header> 
          <Link to = "/" className = "title">DashFit </Link>
        </Header>
        <Nav>
          <NavItem to = "/" name = "Log Weight"/>
          <NavItem to = "/visualize" name = "Visualize"/>
        </Nav>
        <MainContent id = "main">
          {this.props.children}
        </MainContent>
      </div>
    );
  }
}

render((
  <Router history = {hashHistory}>
    <Route path = "/" component = {App}>
      <IndexRoute component = {LogWeight}/>
      <Route path = "visualize" component = {Visualize}/>
    </Route>
  </Router>
),document.getElementById('app'));