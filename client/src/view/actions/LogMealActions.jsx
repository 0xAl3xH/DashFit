import dispatcher from "view/dispatcher";

//Handles any input changes
export function handleInputChange(key, val, subkey) {
  dispatcher.dispatch({
    type: "CHANGE_INPUT",
    key,
    val,
    subkey,
  })
}

export function getMeals(start, end) {
  dispatcher.dispatch({
    type: "GETTING_MEALS"
  });
  
  fetch('/meals/query',{
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

export function createMeal(meal) {
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

export function updateComponentLen(len) {
  dispatcher.dispatch({
    type: "CHANGE_COMPONENT_LEN",
    len,
  });
}