import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, hashHistory} from 'react-router';

// Import React components
import HelloWorld from './components/Test/HelloWorld.jsx';
import Header from './components/Header/Header.jsx';
import Nav from './components/Nav/Nav.jsx';
import NavItem from './components/Nav/NavItem/NavItem.jsx';
import MainContent from './components/MainContent/MainContent.jsx';

// Use Skeleton styling boilerplate
import './shared_styles/skeleton.less'

const Home = () => (
  <h2>Home page</h2>
);

const Page = () => (
  <h2>Some other page</h2>
);

class App extends React.Component {
  render () {
    return (
      <div>
        <Header> 
          DashFit 
        </Header>
        <Nav>
          <NavItem name = "Log Weight"/>
          <NavItem name = "Visualize"/>
        </Nav>
        <MainContent id = "main">
          <Router history={hashHistory}>
            <Route path = "/" component = {Home}/>
            <Route path = "/page" component = {Page}/>
          </Router>
        </MainContent>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));