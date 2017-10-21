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

export function updateComponentLen(op, id) {
  dispatcher.dispatch({
    type: "CHANGE_COMPONENT_LEN",
    op,
    id,
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
