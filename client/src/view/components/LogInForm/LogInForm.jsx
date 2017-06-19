//TODO: Look into webpack aliasing for relative imports to avoid ../../../........hell
import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';

export default class LogInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkLoggedIn = this.props.checkLoggedIn;
  }
  
  componentWillMount() {
    this.checkLoggedIn(false);
  }
  
  submitUserInfo() {
    const myHeaders = {
      "Content-Type":'application/json'
    };
    
    return fetch('/weight/submit',{
      method:'POST',
      headers: myHeaders,
      body: JSON.stringify({
        time:this.state.selectedDate,
        weight: this.state.curWeight
      })
    }).then(res =>{
      console.log(res);
      this.setNewState(this.state.selectedDate);
    });  
  }
  
  render () {
    return ( 
      <MainContent id="login-form">
        <Title>Welcome to DashFit!</Title>
        <div className="status-text">Please log in to continue:</div>
        <div className = "username-container">
          <label htmlFor="username">Username:</label>
          <input className="u-full-width" id="username" type="text"></input>          
        </div>
        <div className = "password-container">
          <label htmlFor="password">Password:</label>
          <input className="u-full-width" id="password" type="password"></input>          
        </div>
        <div className="submit-container">
          <input className="button-primary button-medium user-submit" type="submit" value="Submit" onClick=""/>
        </div>
      </MainContent>
    );
  }
}