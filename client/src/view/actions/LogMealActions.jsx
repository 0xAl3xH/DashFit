import dispatcher from "view/dispatcher";

//Handles any input changes
export function handleInputChange(key, val, indkey) {
  dispatcher.dispatch({
    type: "CHANGE_INPUT",
    key,
    val,
    indkey,
  })
}

export function updateComponentLen(op, id, component) {
  dispatcher.dispatch({
    type: "CHANGE_COMPONENT_LEN",
    op,
    id,
    component,
  });
}

export function updateEditted(editted) {
  dispatcher.dispatch({
    type: "UPDATE_EDITTED",
    editted,
  });
}

export function updateDate(date) {
  dispatcher.dispatch({
    type:"UPDATE_DATE",
    date
  });
}

export function getMeals(start, end) {
  dispatcher.dispatch({
    type: "GETTING_MEALS"
  });
  
  fetch('/meals/query_meals',{
    method:'POST',
    headers: {
      "Content-Type":'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      start,
      end
    })
  }).then((res) => {
    return res.json();
  }).then((meals) => {
    dispatcher.dispatch({
        type: "GOT_MEALS",
        meals,
      });
  });
}

export function getComponents() {
  fetch('/meals/query_components',{
    method:'POST',
    headers: {
      "Content-Type":'application/json'
    },
    credentials: 'include'
  }).then((res) => {
    return res.json();
  }).then((components) => {
    console.log(components);
    // Filter duplicate components
    let component_records = {}; // name : calories
    let filtered_components = [];
    components.forEach(component => {
      const name = component.name.trim();
      const calories = component.calories;
      if (name in component_records) {
        const calories_set = component_records[name];
        // check for duplicate by looking at repeated calories
        if (!calories_set.has(calories)) {
          filtered_components.push(component);
          component_records[name].add(calories);
        }
      } else {
        // add to record
        component_records[name] = new Set([calories]);
        filtered_components.push(component);
      }
    });
    console.log(filtered_components);
    dispatcher.dispatch({
        type: "GOT_COMPONENTS",
        filtered_components,
      });
  });
}

export function createMeal(meal, ind) {
  dispatcher.dispatch({
    type: "POSTING_MEAL"
  });
  
  fetch('/meals/submit',{
    method:'POST',
    headers: {
      "Content-Type":'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(meal)
  }).then((res) => {
    return res.json();
  }).then((meal) => {
    dispatcher.dispatch({
        type: "CREATE_MEAL",
        meal,
        ind
      });
  });
}

export function deleteMeal(id) {
  dispatcher.dispatch({
    type: "DELETING_MEAL"
  });
  
  fetch('/meals/delete/' + id, {
    method:'DELETE',
    credentials: 'include',
  }).then((res) => {
    return res.json();
  }).then((meal) => {
    dispatcher.dispatch({
        type: "DELETE_MEAL",
        meal,
      });
  });
}
