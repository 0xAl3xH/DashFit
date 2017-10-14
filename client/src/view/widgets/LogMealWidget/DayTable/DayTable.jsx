import React from 'react';

export default class DayTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  componentDidMount() {
  }
  
  render () {
    return ( 
      <table className="day-log">
        <thead>
          <tr>
            <th>Name</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Quantity</th>
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
            </td>
            <td>
              <input className="button-primary button-medium button-meal-option" type="submit" value="+"/>
              <input className="button-primary button-medium button-meal-option" type="submit" value="x"/>
            </td>
          </tr>
          <tr>
            <td>
              <input id="item-input" type="text" placeholder="Entreè/Ingredient"/>
            </td>
            <td>
              <input id="item-cal-input" type="number" placeholder="Item calories"/>
            </td>
            <td>
              <input id="item-pro-input" type="number" placeholder="Item protein"/>
            </td>
            <td>
              <input id="meal-input" type="number"/>
            </td>
          </tr>
        </tbody>
        {this.props.children}
      </table>
    );
  }
}