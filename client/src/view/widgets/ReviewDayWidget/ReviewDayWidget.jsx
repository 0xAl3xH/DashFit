import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import * as ReviewDayActions from 'actions/ReviewDayActions';
import ReviewDayStore from 'stores/ReviewDayStore';
import DatePicker from 'react-datepicker';
// star-rating has been modified - original author is inactive. @TODO Consider making this its own module under view?
import StarRating from 'react-star-rating';
import 'shared_styles/react-star-rating.less';
import 'shared_styles/react-datepicker.less';

export default class ReviewDay extends React.Component {
  constructor(props) {
    super(props);
    
    let now = moment();
    
    this.state = {
      date: now,
      rating: ReviewDayStore.getRating(),
      comment: "",
      saved: true
    }
    
    this.lastKeystrokeTime = moment();
    this.saving = false;
    
    this.updateDate = this.updateDate.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.updateSaveStatus = this.updateSaveStatus.bind(this);
    this.getRating = this.getRating.bind(this);
    this.getComment = this.getComment.bind(this);
    this.saveReview = this.saveReview.bind(this);
    this.getReview = this.getReview.bind(this);
    this.autoSave = this.autoSave.bind(this);
  }
  
  componentWillMount() {
    ReviewDayStore.on("RATING_UPDATED", this.getRating);
    ReviewDayStore.on("COMMENT_UPDATED", this.getComment);
    ReviewDayStore.on("REVIEW_SAVED", this.updateSaveStatus);
    
    let bounds = this.getCalendarBounds(this.state.date.clone());
    // Get the review initially
    ReviewDayStore.once("REVIEW_GOT", this.getReview);
    ReviewDayActions.getReview(bounds[0], bounds[1]);
    ReviewDayActions.updateDate(this.state.date);
    
    setInterval(this.autoSave, 200);
  }
  
  componentWillUnmount() {
    ReviewDayStore.removeListener("RATING_UPDATED", this.getRating);
    ReviewDayStore.removeListener("COMMENT_UPDATED", this.getComment);
    ReviewDayStore.removeListener("REVIEW_SAVED", this.updateSaveStatus);
  }
  
  componentDidMount() {
  }
  
  autoSave() {
    // See if user is still typing
    const stillTyping = moment().diff(this.lastKeystrokeTime, 'milliseconds') < 750;
    
    if (!this.state.saved && !stillTyping && !this.saving) {
      this.saveReview();
    }
  }
  
  getCalendarBounds(date) {
    let start = date.clone().startOf('month').subtract(date.clone().startOf('month').day(), 'day'),
        end = date.clone().endOf('month').add(6 - date.clone().endOf('month').day(), 'day');
    return [start, end];
  }
  
  updateDate(date) {
    // date clicked on with hour and minute updated to current time
    let clickDate = date.clone().hour(moment().hour()).minute(moment().minute());
    
    // Request data only if month has changed
    if (date.month() != this.state.date.month()) {
      console.log('requesting new data');
      let bounds = this.getCalendarBounds(date);
      ReviewDayActions.updateDate(clickDate);
      ReviewDayStore.once("REVIEW_GOT", this.getReview);
      ReviewDayActions.getReview(bounds[0], bounds[1]);
    } else {
      // already have this cached if month has not changed
      ReviewDayStore.once("DATE_UPDATED", this.getReview);
      ReviewDayActions.updateDate(clickDate);
    }
    this.setState({
      date: clickDate,
    });
  }
  
  updateRating(rating) {
    this.setState({
      saved: false
    });
    ReviewDayActions.updateRating(rating);
    this.lastKeystrokeTime = moment();
  }
  
  getRating() {
    this.setState({
      rating: ReviewDayStore.getRating(),
    });
  }
  
  
  getComment() {
    this.setState({
      comment: ReviewDayStore.getComment(),
    });
  }
  
  updateComment(e) {
    this.setState({
      saved: false
    });
    ReviewDayActions.updateComment(e.target.value);
    this.lastKeystrokeTime = moment();
  }
  
  updateSaveStatus() {
    this.setState({
      saved: true,
    });
    this.saving = false;
    
    //console.log(ReviewDayStore.getReviews());
  }
  
  saveReview() {
    const review = {
      //Keep date as a string since moment's .toJSON discards time zone info
      date: this.state.date.format(),
      rating: this.state.rating,
      comment: this.state.comment
    };
    ReviewDayActions.saveReview(review);
    this.saving = true;
  }
  
  getReview() {
    console.log("update view");
    this.getRating();
    this.getComment();
  }
  
  highlightDates(date) {
    let reviews = ReviewDayStore.getReviews(),
        dayKey = date.clone().startOf('day'),
        review = reviews[dayKey];
    if (review) {
      if (review.comment) 
        return 'highlight-day comment';
      else 
        return 'highlight-day rating';
    }
  }
  
  
  render() {
    return (
      <MainContent>
        <Title>Day Review</Title>
        <div>
          <label>Select Date:</label>
          <DatePicker id="datepicker" selected={this.state.date} readOnly={true} onChange={this.updateDate} tetherConstraints={[]} dayClassName={date => this.highlightDates(date)}/>
        </div>
        <div>
          <label>Rate Day:</label>
          <StarRating name="react-star-rating" rating={this.state.rating} editing={true} totalStars={5} onRatingClick={(e, d)=>{this.updateRating(d.rating)}}/>
        </div>
        <div className="review-day-comments-container">
          <label>Comments:</label>
          {this.state.saved ? <span className="autosave-status">Changes saved...</span> : <span className="autosave-status">Some Changes Unsaved...</span>}
          <textarea id="review-day-comments" type="text" maxLength="5000" onChange={this.updateComment} value={this.state.comment}></textarea>
        </div>
          <input className="button-primary button-medium review-day-save-button" type="submit" value="Save" onClick={this.saveReview}/>
      </MainContent>
    )
  }
}