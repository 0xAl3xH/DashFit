import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';

/**
* Widget which facilitates taking client inputs for weight information 
* and submits it to the sever. Additionally, it also gets corresponding
* weight data from the server when the client requests it. All of the 
* AJAX calls for logging weight should be made here.
*
* Displays weight for the week of the selected day. A week in this 
* context is defined as Tuesday to Monday.
**/
export default class LogWeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  componentDidMount() {
  }
  
  render () {
    return ( 
      <MainContent>
        <Title>Meal Log</Title>
        <h5>Friday, 10/13</h5>
        <table className="day-log">
          <thead>
            <tr>
              <th>Name</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            <tr className="flattened-row">
              <td>
                <input id="meal-input" type="text" placeholder="Meal Name"/>
              </td>
              <td>
              </td>
              <td>
              </td>
              <td>
                <input className="button-primary button-medium button-meal-option" type="submit" value="+"/>
                <input className="button-primary button-medium" type="submit" value="x"/>
              </td>
            </tr>
            <tr className="flattened-row">
              <td>
                <input id="item-input" type="text" placeholder="Entreè/Ingredient"/>
              </td>
              <td>
                <input id="item-cal-input" type="number" placeholder="Item calories"/>
              </td>
              <td>
                <input id="item-pro-input" type="number" placeholder="Item protein"/>
              </td>
            </tr>
            <tr className="flattened-row">
              <td>
                <b>Lunch</b>
              </td>
            </tr>
            <tr>
              <td>
                Salsa chicken tray
              </td>
              <td>
                420
              </td>
              <td>
                30
              </td>
              <td>
                <input className="button-primary button-medium button-meal-option" type="submit" value="Edit"/>
                <input className="button-primary button-medium" type="submit" value="x"/>
              </td>
            </tr>
          </tbody>
        </table>
      </MainContent>
    );
  }
}