import { EventEmitter } from "events";

import dispatcher from "view/dispatcher"

class LogMealStore extends EventEmitter {
  constructor() {
    super();
    this.meals = [
      {
        name: 'Lunch',
        //time
        components: [{
          name: 'Salsa Chicken Tray',
          calories: 420,
          protein: 30,
          quantity: 1
        }, {
          name: 'Apple',
          calories: 100,
          quantity: 1
        }]
      }, {
        name: 'Dinner',
        //time
        components: [{
          name: 'Salsa Chicken Tray',
          calories: 420,
          protein: 30,
          quantity: 1
        }, {
          name: 'Apple',
          calories: 100,
          quantity: 1
        }]
      }
    ];
  }
  
  handleActions(action) {
    switch(action.type) {
      case "CREATE_MEAL": {
        this.createMeal(action.meal);
      }
    }
  }
  
  createMeal(meal) {
    this.meals.push(meal);
    this.emit("MEAL_CREATED");
  }
  
  getTest() {
    return this.meals;
  }
}

const logMealStore = new LogMealStore;
// Bind logMealStore so "this" is correct 
dispatcher.register(logMealStore.handleActions.bind(logMealStore));
window.dispatcher = dispatcher;
export default logMealStore;