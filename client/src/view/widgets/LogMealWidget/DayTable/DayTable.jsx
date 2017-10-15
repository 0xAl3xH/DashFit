import React from 'react';
import LogMealStore from 'stores/LogMealStore';
import * as LogMealActions from 'actions/LogMealActions';

export default class DayTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input_vals: LogMealStore.getInputVals(),
      component_len: LogMealStore.getComponentLen()
    };
    this.updateInput = this.updateInput.bind(this);
    this.updateComponentLen = this.updateComponentLen.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createMeal = this.createMeal.bind(this);
    this.handleComponentLenChange = this.handleComponentLenChange.bind(this);
  }
  
  componentWillMount() {
    console.log(LogMealStore.listenerCount("INPUT_CHANGED"));
    console.log(LogMealStore.listenerCount("COMPONENT_LEN_CHANGED"));
    LogMealStore.on("INPUT_CHANGED", this.updateInput);
    LogMealStore.on("COMPONENT_LEN_CHANGED", this.updateComponentLen);
    LogMealActions.updateComponentLen(this.state.component_len);
  }
  
  componentWillUnmount() {
    LogMealStore.removeListener("INPUT_CHANGED", this.updateInput);
    LogMealStore.removeListener("COMPONENT_LEN_CHANGED", this.updateComponentLen);
  }
  
  componentDidMount() {
  }
  
  updateInput() {
    this.setState({
        input_vals: LogMealStore.getInputVals(),
      });
  }
  
  updateComponentLen() {
    this.setState({
        component_len: LogMealStore.getComponentLen(),
      });
  }
  
  handleInputChange(key, subkey) {
    return function(e) {
      LogMealActions.handleInputChange(key, e.target.value, subkey);
    }
  }
  
  clearInputForm() {
    LogMealActions.handleInputChange('meal_name', '');
    LogMealActions.updateComponentLen(0);
    LogMealActions.updateComponentLen(1);
  }
  
  // add i to number of components there are in the meal
  handleComponentLenChange(i, should_change) {
    console.log("der");
    if (should_change) {
      LogMealActions.updateComponentLen(this.state.component_len + i);
    }
  }
  
  createMeal() {
    const input_vals = this.state.input_vals;
    const meal = {
      name: input_vals.meal_name,
      time: Date.now(),
      components: [],
    };
    for (let i = 0; i < this.state.component_len; i++) {
      let component = input_vals["component"+i];
      if (component.name && component.calories) {
        meal.components.push(
          {
            name: component.name,
            calories: component.calories,
            protein: component.protein,
            quantity: component.quantity ? component.quantity : 1,
          }
        );
      }
    }
    if (input_vals.meal_name && meal.components.length) {
      LogMealActions.createMeal(meal);
      // Clear input form 
      this.clearInputForm();
    }
  }
  
  generateComponentInputs(len) {
    const row = []
    for (let i =0; i < len; i++) {
      let row_id = "component" + i;
      let component = this.state.input_vals[row_id];
      console.log(this.state.input_vals);
      console.log(row_id, component);
      row.push(
        <tr id={row_id} key={row_id} className={i != (len - 1) ? "flattened-row": ""}>
          <td>
            <input type="text" placeholder="Entreè/Ingredient" value={component.name} onChange={this.handleInputChange(row_id, "name")} onFocus={i == (len - 1) ? () => {this.handleComponentLenChange(1, true)}: () => {}} onBlur={i == (len - 2) ? () => {this.handleComponentLenChange(-1, component.name == "")}: () => {}}/>
          </td>
          <td>
            <input type="number" placeholder="Item calories" value={component.calories} onChange={this.handleInputChange(row_id, "calories")}/>
          </td>
          <td>
            <input type="number" placeholder="Item protein" value={component.protein} onChange={this.handleInputChange(row_id, "protein")}/>
          </td>
          <td>
            <input type="number" value={component.quantity} onChange={this.handleInputChange(row_id, "quantity")}/>
          </td>
        </tr>
      );
    }
    return row;
  }
  
  render () {
    return ( 
      <table className="day-log">
        <thead>
          <tr>
            <th>Name</th>
            <th className = "calories">Calories</th>
            <th>Protein</th>
            <th>Quantity</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr className="flattened-row">
            <td>
              <input id="meal-input" type="text" value={this.state.input_vals.meal_name} placeholder="Meal Name" onChange={this.handleInputChange("meal_name")}/>
            </td>
            <td>
            </td>
            <td>
            </td>
            <td>
            </td>
            <td>
              <input className="button-primary button-medium button-meal-option" type="submit" value="+" onClick={this.createMeal}/>
              <input className="button-primary button-medium button-meal-option" type="submit" value="x" onClick={this.clearInputForm}/>
            </td>
          </tr>
          {this.generateComponentInputs(this.state.component_len)}
        </tbody>
        {this.props.children}
      </table>
    );
  }
}