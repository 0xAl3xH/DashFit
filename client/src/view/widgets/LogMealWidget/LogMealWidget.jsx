import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import DayTable from 'widgets/LogMealWidget/DayTable/DayTable';
import LogMealStore from 'stores/LogMealStore';

export default class LogMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meals: LogMealStore.getTest(),
    }
  }
  
  componentWillMount() {
    LogMealStore.on("MEAL_CREATED", () => {
      this.setState({
        meals: LogMealStore.getTest(),
      });
    });
  }
  
  componentDidMount() {
  }
  
  generateMealRows(meals) {
    const rows = [];
    for (let i = 0; i < meals.length; i++) {
      let components = [];
      let meal = meals[i];
      for(let j = 0; j < meal.components.length; j++) {
        let component = meal.components[j];
        components.push(
          <tr key={j} className={j == meal.components.length - 1? "" : "flattened-row"}>
            <td>
              {component.name}
            </td>
            <td>
              {component.calories}
            </td>
            <td>
              {component.protein}
            </td>
            <td>
              {component.quantity}
            </td>
            <td>
              <input className="button-primary button-medium button-meal-option" type="submit" value="Edit"/>
              <input className="button-primary button-medium button-meal-option" type="submit" value="x"/>
            </td>
          </tr>
        )
      }
      
      rows.unshift(
        <tbody key={i}>
          <tr className="flattened-row">
            <td>
              <b>{meal.name}</b>
            </td>
          </tr>
          {components}
        </tbody>
      );
    }  
    return rows;
  }
  
  render () {
    return ( 
      <MainContent>
        <Title>Meal Log</Title>
        <h5>Friday, 10/13</h5>
        <DayTable>
          {this.generateMealRows(this.state.meals)}
        </DayTable>
      </MainContent>
    );
  }
}