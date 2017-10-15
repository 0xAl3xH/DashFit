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

export function createMeal(meal) {
  dispatcher.dispatch({
    type: "CREATE_MEAL",
    meal,
  });
}

export function updateComponentLen(len) {
  dispatcher.dispatch({
    type: "CHANGE_COMPONENT_LEN",
    len,
  });
}