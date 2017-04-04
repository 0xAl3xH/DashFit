import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router';

// Use Skeleton styling boilerplate
import './shared_styles/skeleton.less'

// Import React components
import HelloWorld from 'components/Test/HelloWorld';
import Header from 'components/Header/Header';
import Nav from 'components/Nav/Nav';
import NavItem from 'components/Nav/NavItem/NavItem';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';

// Import "widgets"
import LogWeight from 'components/LogWeightWidget/LogWeightWidget';

const Visualize = () => (
    <MainContent>
      <Title>Visualize</Title>
    </MainContent>
);

class App extends React.Component {
  
  constructor() {
    super();  
    this.state=({offset:0});
  }
  
  headerOffsetHandler (height) {
    this.setState({offset:height});
  }
  
  render () {
    return (
      <div>
        <Header className="header" headerOffsetFunc={this.headerOffsetHandler.bind(this)}> 
          <Link to = "/" className = "title">DashFit </Link>
        </Header>
        <div style={{height:window.innerHeight-this.state.offset}}>
          <Nav>
            <NavItem to = "/" name = "Log Weight"/>
            <NavItem to = "/visualize" name = "Visualize"/>
          </Nav>
          {this.props.children}
        </div>
      </div>
    );
  }
}

//TODO: Look into way to cache state upon component unmount 
//      so fewer server calls are made
render((
  <Router history = {hashHistory}>
    <Route path = "/" component = {App}>
      <IndexRoute component = {()=>(<LogWeight/>)}/>
      <Route path = "visualize" component = {Visualize}/>
    </Route>
  </Router>
),document.getElementById('app'));