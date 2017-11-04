import { EventEmitter } from "events";
import dispatcher from "view/dispatcher";
import moment from 'moment';

class ReviewDayStore extends EventEmitter {
  constructor() {
    super();
    this.comment = "";
    this.rating = 0;
  }
  
  handleActions(action) {
    switch(action.type) {
      case "UPDATE_RATING":
        this.updateRating(action.rating);
        break;
      case "UPDATE_COMMENT":
        this.updateComment(action.comment);
        break;
      case "GOT_REVIEW":
        this.gotReview(action.review);
        break;
    }
  }
  
  updateRating(rating) { 
    this.rating = rating;
    this.emit("RATING_UPDATED");
  }  
  getRating() {
    return this.rating;
  }
  
  updateComment(comment) {
    this.comment = comment;
    this.emit("COMMENT_UPDATED");
  }
  getComment() {
    return this.comment;
  }
  
  gotReview(review) {
    if (review) {
      this.comment = review.comment;
      this.rating = review.rating; 
    } else {
      this.comment = "";
      this.rating = 0;
    }
    this.emit("REVIEW_GOT");
  }
}

const reviewDayStore = new ReviewDayStore;
// Bind logMealStore so "this" is correct 
dispatcher.register(reviewDayStore.handleActions.bind(reviewDayStore));
export default reviewDayStore;