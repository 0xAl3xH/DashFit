import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import DayTableInput from 'widgets/LogMealWidget/DayTableInput/DayTableInput';
import * as LogMealActions from 'actions/LogMealActions';
import LogMealStore from 'stores/LogMealStore';
import { includes } from 'lodash';
import DatePicker from 'react-datepicker';
import 'shared_styles/react-datepicker.less';

export default class LogMeal extends React.Component {
  constructor(props) {
    super(props);
    
    let now = moment();
    this.state = {
      date: now,
      meals: LogMealStore.getMeals(),
      editted: LogMealStore.getEditted(),
    }
    this.updateMeals = this.updateMeals.bind(this);
    this.updateEditted = this.updateEditted.bind(this);
    this.updateDate = this.updateDate.bind(this);
  }
  
  componentWillMount() {
    LogMealActions.getMeals(this.state.date.clone().startOf('day'), this.state.date.clone().endOf('day'));
    LogMealStore.on("MEALS_UPDATED", this.updateMeals);
    LogMealStore.on("EDITTED_UPDATED", this.updateEditted);
  }
  
  componentWillUnmount() {
    LogMealStore.removeListener("MEALS_UPDATED", this.updateMeals);
    LogMealStore.removeListener("EDITTED_UPDATED", this.updateEditted);
  }
  
  componentDidMount() {
  }
  
  updateMeals() {
    this.setState({
      meals: LogMealStore.getMeals(),
    });
  }
  
  updateEditted() {
    this.setState({
      editted: LogMealStore.getEditted(),
    });
  }
  
  updateDate(date) {
    LogMealActions.getMeals(date.clone().startOf('day'), date.clone().endOf('day'));
    this.setState({
      date: date.clone().hour(moment().hour()).minute(moment().minute()),
    });
  }
  
  handleMealDelete(id) {
    return () => {
      LogMealActions.deleteMeal(id);
    }
  }
  
  handleMealEdit(id) {
    return () => {
      let new_editted = this.state.editted.slice();
      new_editted.push(id);
      LogMealActions.updateEditted(new_editted);
    }
  }
  
  getTotalCalories() {
    if (this.state.meals) {
      let meal_calorie_list = this.state.meals.map((meal) => {
        return meal.components.reduce((component1, component2) =>{
          return component1 + component2.quantity * component2.calories;
        }, 0);
      });
      return meal_calorie_list.reduce((meal1, meal2) =>{
        return meal1 + meal2;
      }, 0);
    }
  }
  
  getTotalProtein() {
    if (this.state.meals) {
      let meal_protein_list = this.state.meals.map((meal) => {
        return meal.components.reduce((component1, component2) =>{
          return component1 + component2.quantity * component2.protein;
        }, 0);
      });
      return meal_protein_list.reduce((meal1, meal2) =>{
        return meal1 + meal2;
      }, 0);
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
      if (includes(this.state.editted, meal._id)) {
        rows.unshift(<DayTableInput key={i} input_id={meal._id} time={this.state.date}/>);
      }
      else {
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
              <input className="button-primary button-medium button-meal-option" type="submit" value="Edit" onClick={this.handleMealEdit(meal._id)}/>
              <input className="button-primary button-medium button-meal-option" type="submit" value="x" onClick={this.handleMealDelete(meal._id)}/>
            </td>
          </tr>
          {components}
        </tbody>
      );
      }
    }  
    return rows;
  }
  
  render () {
    return ( 
      <MainContent>
        <Title>Meal Log</Title>
        <div>
          <label>Select Date:</label>
          <DatePicker selected={this.state.date} readOnly={true} onChange={this.updateDate} tetherConstraints={[]}/>
        </div>
        <h5>{this.state.date.format('dddd, M/D')}</h5>
        <div>Total calories: {this.getTotalCalories()}</div>
        <div>Total Protein: {this.getTotalProtein()}</div>
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
          <DayTableInput input_id="0" time={this.state.date}/>
          {this.generateMealRows(this.state.meals)}
        </table>
      </MainContent>
    );
  }
}