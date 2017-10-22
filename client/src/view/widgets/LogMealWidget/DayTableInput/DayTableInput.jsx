import React from 'react';
import LogMealStore from 'stores/LogMealStore';
import * as LogMealActions from 'actions/LogMealActions';
import moment from 'moment';
import { findIndex } from 'lodash';

export default class DayTableInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meal: LogMealStore.getInputVals(this.props.input_id),
    };
    this.updateInput = this.updateInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createMeal = this.createMeal.bind(this);
    this.clearInputForm = this.clearInputForm.bind(this);
  }
  
  componentWillMount() {
    LogMealStore.on("INPUT_CHANGED", this.updateInput);
  }
  
  componentWillUnmount() {
    LogMealStore.removeListener("INPUT_CHANGED", this.updateInput);
  }
  
  componentDidMount() {
  }
  
  updateInput() {
    this.setState({
        meal: LogMealStore.getInputVals(this.props.input_id),
      });
  }
  
  handleInputChange(key, component_index_key) {
    return (e) => {
      LogMealActions.handleInputChange(this.props.input_id, e.target.value, component_index_key);
    }
  }
  
  clearInputForm() {
    LogMealActions.handleInputChange(this.props.input_id, "");
    let len = this.state.meal.components.length;
    for (let i = 0; i < len; i ++) {
      LogMealActions.updateComponentLen('dec', this.props.input_id);
    }
    LogMealActions.updateComponentLen('inc', this.props.input_id);
  }
  
  // op can be increment or decrement
  handleComponentLenChange(op, id, should_change) {
    console.log(op, should_change)
    if (should_change) {
      LogMealActions.updateComponentLen(op, id);
    }
  }
  
  createMeal() {
    const meal_input = this.state.meal;
    const meal = {
      name: meal_input.name,
      time: this.props.time,
      components: [],
    };
    
    let edit_ind = undefined;
    if (meal_input._id) {
      meal._id = meal_input._id
      edit_ind = findIndex(LogMealStore.getMeals(), { _id: meal._id});
      let new_editted = LogMealStore.getEditted().filter((id) =>{
            return id != meal._id;
          });
      LogMealActions.updateEditted(new_editted);
    }
    
    for (let i = 0; i < meal_input.components.length; i++) {
      let component = meal_input.components[i];
      if (component.name && component.calories) {
        meal.components.push(
          {
            name: component.name,
            calories: component.calories,
            protein: component.protein ? component.protein : 0,
            quantity: component.quantity ? component.quantity : 1,
          }
        );
      }
    }
    
    if (meal.name && meal.components.length) {
      if (typeof edit_ind != 'undefined') {
        LogMealActions.createMeal(meal, edit_ind);
      } else {
        LogMealActions.createMeal(meal);
        // Clear input form 
        this.clearInputForm();
      }
    }
  }
  
  generateComponentInputs(len) {
    const row = []
    const input_id = this.state.meal._id ? this.state.meal._id : 0;
    for (let i =0; i < len; i++) {
      let component = this.state.meal.components[i];
      row.push(
        <tr key={i} className={i != (len - 1) ? "flattened-row": ""}>
          <td>
            <input type="text" placeholder="Ingredient" value={component.name} onChange={this.handleInputChange(input_id, [i, "name"])} onFocus={i == (len - 1) ? () => {this.handleComponentLenChange('inc', input_id, true)}: () => {}} onBlur={i == (len - 2) ? () => {this.handleComponentLenChange('dec', input_id, component.name == "")}: () => {}}/>
          </td>
          <td>
            <input type="number" placeholder="Cal" value={component.calories} onChange={this.handleInputChange(input_id, [i, "calories"])}/>
          </td>
          <td>
            <input type="number" placeholder="Pro" value={component.protein} onChange={this.handleInputChange(input_id, [i, "protein"])}/>
          </td>
          <td>
            <input type="number" value={component.quantity} onChange={this.handleInputChange(input_id, [i,"quantity"])}/>
          </td>
          <td>
          </td>
        </tr>
      );
    }
    return row;
  }
  
  render () {
    const input_id = this.state.meal._id ? this.state.meal._id : 0;
    return ( 
      <tbody>
        <tr className="flattened-row">
          <td>
            <input id="meal-input" type="text" value={this.state.meal.name} placeholder="Meal Name" onChange={this.handleInputChange(input_id)}/>
          </td>
          <td>
          </td>
          <td>
          </td>
          <td>
          </td>
            {input_id
              ? <td>
                  <input className="button-primary button-medium button-meal-option" type="submit" value="Save" onClick={this.createMeal}/>
                </td>
              : <td>
                  <input className="button-primary button-medium button-meal-option" type="submit" value="+" onClick={this.createMeal}/>
                  <input className="button-primary button-medium button-meal-option" type="submit" value="x" onClick={this.clearInputForm}/>
                </td>
            }
        </tr>
        {this.generateComponentInputs(this.state.meal.components.length)}
      </tbody>
    );
  }
}