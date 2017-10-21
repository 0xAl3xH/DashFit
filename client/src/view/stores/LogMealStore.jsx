import { EventEmitter } from "events";
import { includes, find} from "lodash";
import dispatcher from "view/dispatcher";
import moment from 'moment';

class LogMealStore extends EventEmitter {
  constructor() {
    super();
    this.date = moment();
    this.meals = [];
    this.inputs = {
      0: {
        name:"",
        components:[{
          name:"",
          calories:"",
          protein:"",
          quantity:"",
        }]
      },
    };
    this.editted = [];
  }
  
  handleActions(action) {
    switch(action.type) {
        
      case "GOT_MEALS":
        this.updateMeals(action.meals);
        break;
        
      case "CREATE_MEAL":
        this.createMeal(action.meal, action.ind);
        break;
        
      case "DELETE_MEAL":
        this.deleteMeal(action.meal);
        break;
        
      case "UPDATE_EDITTED":
        this.updateEditted(action.editted);
        break;
        
      case "UPDATE_DATE":
        this.updateDate(action.date);
        break;
        
      case "CHANGE_INPUT":
        this.updateInputVals(action.key, action.val, action.indkey);
        break;
        
      case "CHANGE_COMPONENT_LEN":
        this.updateComponentLen(action.op, action.id);
        break;
    }
  }
  
  deleteMeal(meal) {
    if (meal) {
      this.meals = this.meals.filter((el) =>{
        return el._id !== meal._id;
      });
      this.emit("MEALS_UPDATED");
    }
  }
  
  updateMeals(meals) {
    this.meals = meals;
    this.emit("MEALS_UPDATED");
  }
  
  updateEditted(editted) {
    this.editted = editted;
    this.emit("EDITTED_UPDATED");
  }
  
  updateDate(date) {
    this.date = date;
    this.emit("DATE_UPDATED");
  }
  
  updateInputVals(key, val, indkey) {
    if (typeof indkey === 'undefined') {
      this.inputs[key].name = val;
    }
    else {
      this.inputs[key].components[indkey[0]][indkey[1]] = val
    }
    this.emit("INPUT_CHANGED");
  }
  
  createMeal(meal, ind) {
    if (typeof ind === 'undefined') {
      this.meals.push(meal);  
    } else {
      this.meals[ind] = meal;
    }
    this.emit("MEALS_UPDATED");
  }
  
  updateComponentLen(op, id) {
    console.log(this.inputs[id]);
    if (op == 'inc') {
      this.inputs[id].components.push({
        name:"",
        calories: "",
        protein: "",
        quantity: "",
      });
    } else {
      this.inputs[id].components.pop()
    }
    this.emit("INPUT_CHANGED");
  }
  
  getMeals() {
    return this.meals;
  }
  
  getComponentLen() {
    return this.component_len;
  }
  
  getInputVals(id) {
    if (!includes(Object.keys(this.inputs), id)) {
      this.inputs[id] = find(this.meals, {_id: id});
    }
    return this.inputs[id];
  }

  getEditted() {
    return this.editted;
  }
  
  getDate() {
    return this.date;
  }
}

const logMealStore = new LogMealStore;
// Bind logMealStore so "this" is correct 
dispatcher.register(logMealStore.handleActions.bind(logMealStore));
window.dispatcher = dispatcher;
export default logMealStore;