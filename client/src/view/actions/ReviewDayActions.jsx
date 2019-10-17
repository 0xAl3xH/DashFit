import dispatcher from "view/dispatcher";

export function updateDate(date) {
  dispatcher.dispatch({
    type: "UPDATE_DATE",
    date
  });
}

export function updateRating(rating) {
  dispatcher.dispatch({
    type: "UPDATE_RATING",
    rating
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
        type: "SAVED_REVIEW",
        review,
      });
  });
}

export function getReview(startt, endt) {
  dispatcher.dispatch({
    type: "GETTING_REVIEW"
  });
  
  const start = startt,
        end = endt;
  
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
  }).then((reviews) => {
    dispatcher.dispatch({
        type: "GOT_REVIEW",
        reviews,
      });
  });
}