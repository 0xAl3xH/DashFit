//TODO: Look into webpack aliasing for relative imports to avoid ../../../........hell
import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';

export default class LogInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username:"",
                  password:""};
    this.checkLoggedIn = this.props.checkLoggedIn;
    this.checkFetch = this.props.checkFetch;
  }
  
  logIn() {
    const myHeaders = {
      "Content-Type":'application/json'
    };
    
    return fetch('/login',{
      method:'POST',
      headers: myHeaders,
      credentials: 'include',
      body: JSON.stringify({
        username:this.state.username,
        password: this.state.password
      })
    }).then(res =>{
      return res.json();
    }).then(loggedOn => {
      this.checkLoggedIn(loggedOn);
    });  
  }
  
  render () {
    return ( 
      <MainContent id="login-form">
        <Title>Welcome to DashFit!</Title>
        <div className="status-text">Please log in to continue:</div>
        <div className = "username-container">
          <label htmlFor="username">Username:</label>
          <input className="u-full-width" id="username" type="text" value={this.state.username} onChange={ (e) => this.setState({username:e.target.value})}></input>          
        </div>
        <div className = "password-container">
          <label htmlFor="password">Password:</label>
          <input className="u-full-width" id="password" type="password" value={this.state.password} onChange={ (e) => this.setState({password:e.target.value})}></input>          
        </div>
        <div className="submit-container">
          <input className="button-primary button-medium user-submit" type="submit" value="Submit" onClick={this.logIn.bind(this)}/>
        </div>
      </MainContent>
    );
  }
}