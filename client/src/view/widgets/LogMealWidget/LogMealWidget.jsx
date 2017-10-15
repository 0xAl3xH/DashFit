import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import DayTableInput from 'widgets/LogMealWidget/DayTableInput/DayTableInput';
import * as LogMealActions from 'actions/LogMealActions';
import LogMealStore from 'stores/LogMealStore';

export default class LogMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meals: LogMealActions.getMeals(moment().startOf('day'), moment().endOf('day')),
    }
    this.updateMeals = this.updateMeals.bind(this);
  }
  
  componentWillMount() {
    LogMealStore.on("MEALS_UPDATED", this.updateMeals);
  }
  
  componentWillUnmount() {
    LogMealStore.removeListener("MEAL_UPDATED", this.updateMeals);
  }
  
  componentDidMount() {
  }
  
  updateMeals() {
    this.setState({
      meals: LogMealStore.getMeals(),
    });
  }
  
  handleMealDelete(id) {
    return () => {
      console.log(id);
      LogMealActions.deleteMeal(id);
    }
  }
  
  generateMealRows(meals) {
    const rows = [];
    for (let i = 0; i < (meals ? meals.length : 0); i++) {
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
            <td></td>
            <td></td>
            <td></td>
            <td>
              {/*<input className="button-primary button-medium button-meal-option" type="submit" value="Edit" onClick={this.handleMealEdit(i)}/>*/}
              <input className="button-primary button-medium button-meal-option" type="submit" value="x" onClick={this.handleMealDelete(meal._id)}/>
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
        <table className="day-log">
          <thead>
            <tr>
              <th className = "name-col">Name</th>
              <th className = "calories-col">Calories</th>
              <th className = "protein-col">Protein</th>
              <th className = "quant-col">Quantity</th>
              <th className = "opt-col">Options</th>
            </tr>
          </thead>
          <DayTableInput/>
          {this.generateMealRows(this.state.meals)}
        </table>
      </MainContent>
    );
  }
}