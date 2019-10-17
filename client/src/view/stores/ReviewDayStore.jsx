import { EventEmitter } from "events";
import dispatcher from "view/dispatcher";
import moment from 'moment';

class ReviewDayStore extends EventEmitter {
  constructor() {
    super();
    this.today = moment();
    this.comment = "";
    this.rating = 0;
    this.datedReviews = {};
  }
  
  handleActions(action) {
    switch(action.type) {
      case "UPDATE_DATE":
        this.updateDate(action.date);
        break;
      case "UPDATE_RATING":
        this.updateRating(action.rating);
        break;
      case "UPDATE_COMMENT":
        this.updateComment(action.comment);
        break;
      case "GOT_REVIEW":
        this.gotReview(action.reviews);
        break;
      case "SAVED_REVIEW":
        this.savedReview(action.review);
        break;
    }
  }
  
  updateDate(date) {
    this.today = date;
    if (this.datedReviews[this.today.clone().startOf('day')]) {
      let review = this.datedReviews[this.today.clone().startOf('day')];
      console.log(review);
      this.comment = review.comment;
      this.rating = review.rating; 
    } else {
      this.comment = "";
      this.rating = 0;
    }
    this.emit("DATE_UPDATED");
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
  
  getReviews() {
    return this.datedReviews;
  }
  
  gotReview(reviews) {
    // Generates an object whose key is the moment day of the review 
    // and the value is the review 
    function toDatedReviews(rvs) {
      var drvs = {};
      for (var i = 0; i < rvs.length; ++i)
        drvs[moment(rvs[i].time).startOf('day')] = rvs[i];
      return drvs;
    }
    
    this.datedReviews = toDatedReviews(reviews);
    console.log(this.datedReviews);
    
    if (this.datedReviews[this.today.clone().startOf('day')]) {
      let review = this.datedReviews[this.today.clone().startOf('day')];
      this.comment = review.comment;
      this.rating = review.rating; 
    } else {
      this.comment = "";
      this.rating = 0;
    }
    this.emit("REVIEW_GOT");
  }
  
  savedReview(review) {
    this.datedReviews[this.today.startOf('day')] = review;
    this.emit("REVIEW_SAVED");
  }
}

const reviewDayStore = new ReviewDayStore;
// Bind logMealStore so "this" is correct 
dispatcher.register(reviewDayStore.handleActions.bind(reviewDayStore));
export default reviewDayStore;