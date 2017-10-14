import { EventEmitter } from "events";

class LogMealStore extends EventEmitter {
  constructor() {
    super();
    this.meals = [
      {
        name: 'Lunch',
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
  
  getTest() {
    return this.meals;
  }
}

const logMealStore = new LogMealStore;

export default logMealStore;