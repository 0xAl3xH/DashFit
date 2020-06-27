import React from 'react';
import LogMealStore from 'stores/LogMealStore';
import * as LogMealActions from 'actions/LogMealActions';
import Autosuggest from 'react-autosuggest';
import moment from 'moment';
import { findIndex } from 'lodash';

// Imagine you have a list of languages that you'd like to autosuggest.
let suggestionList = [];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength < 3 ? [] : suggestionList.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name + ' (' + suggestion.calories + ' ' + suggestion.protein + ')'}
  </div>
);

export default class DayTableInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meal: LogMealStore.getInputVals(this.props.input_id),
      autosuggest_val: '',
      suggestions:[]
    };
    
    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    this.getSuggestionValue = suggestion => {
      const input_id = this.state.meal._id ? this.state.meal._id : 0;
      delete suggestion._id;
      this.handleComponentLenChange('inc', input_id, true, suggestion);
      this.onSuggestionsClearRequested()
      return ''
    };
    
    this.updateInput = this.updateInput.bind(this);
    this.updateComponents = this.updateComponents.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createMeal = this.createMeal.bind(this);
    this.clearInputForm = this.clearInputForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
  }
  
  onChange (event, {newValue}) {
    this.setState({
      autosuggest_val: newValue
    });
  };
  
  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested ({value}) {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };
  
  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };
  
  componentWillMount() {
    this.loadComponents();
    LogMealStore.on("INPUT_CHANGED", this.updateInput);
    LogMealStore.on("COMPONENTS_UPDATED", this.updateComponents);
  }
  
  componentWillUnmount() {
    LogMealStore.removeListener("INPUT_CHANGED", this.updateInput);
    LogMealStore.removeListener("COMPONENTS_UPDATED", this.updateComponents);
  }
  
  componentDidMount() {
  }
  
  loadComponents() {
    LogMealActions.getComponents();
  }
  
  updateInput() {
    this.setState({
        meal: LogMealStore.getInputVals(this.props.input_id),
      });
  }
  
  updateComponents() {
    suggestionList = LogMealStore.getComponents();
    this.setState({
      suggestions : LogMealStore.getComponents()
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
  handleComponentLenChange(op, id, should_change, component) {
    console.log(op, should_change, component);
    if (should_change) {
      LogMealActions.updateComponentLen(op, id, component);
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
    const suggestions = this.state.suggestions;
    const value = this.state.autosuggest_val;
    const getSuggestionValue = this.getSuggestionValue;
    
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search past meals',
      value: value,
      onChange: this.onChange
    };
    console.log(value);
    return (
      <tbody>
        <tr className="flattened-row">
          <td colSpan="4">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
          </td>
        </tr>
        
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