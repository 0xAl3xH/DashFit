import dispatcher from "view/dispatcher";

export function updateRating(rating) {
  dispatcher.dispatch({
    type: "UPDATE_RATING",
    rating,
  });
}

export function updateComment(comment) {
  dispatcher.dispatch({
    type: "UPDATE_COMMENT",
    comment
  });
}

export function saveReview(review) {
  dispatcher.dispatch({
    type: "SAVING_REVIEW"
  });
  
  fetch('/reviews/submit',{
    method:'POST',
    headers: {
      "Content-Type":'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      review,
    })
  }).then((res) => {
    return res.json();
  }).then((review) => {
    dispatcher.dispatch({
        type: "GOT_REVIEW",
        review,
      });
  });
}

export function getReview(time) {
  dispatcher.dispatch({
    type: "GETTING_REVIEW"
  });
  
  const start = time.clone().startOf('day'),
        end = time.clone().endOf('day');
  
  fetch('/reviews/query', {
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
  }).then((review) => {
    dispatcher.dispatch({
        type: "GOT_REVIEW",
        review,
      });
  });
}