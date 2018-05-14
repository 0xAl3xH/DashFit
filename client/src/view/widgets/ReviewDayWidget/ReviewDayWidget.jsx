import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import * as ReviewDayActions from 'actions/ReviewDayActions';
import ReviewDayStore from 'stores/ReviewDayStore';
import DatePicker from 'react-datepicker';
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
    // Get the review initially
    ReviewDayStore.once("REVIEW_GOT", this.getReview);
    ReviewDayStore.on("REVIEW_GOT", this.updateSaveStatus);
    ReviewDayActions.getReview(this.state.date);
    setInterval(this.autoSave, 200);
  }
  
  componentWillUnmount() {
    ReviewDayStore.removeListener("RATING_UPDATED", this.getRating);
    ReviewDayStore.removeListener("COMMENT_UPDATED", this.getComment);
    ReviewDayStore.removeListener("REVIEW_GOT", this.updateSaveStatus);
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
  
  updateDate(date) {
    ReviewDayActions.getReview(date.clone().hour(moment().hour()).minute(moment().minute()));
    ReviewDayStore.once("REVIEW_GOT", this.getReview);
    this.setState({
      date: date.clone().hour(moment().hour()).minute(moment().minute()),
    });
  }
  
  
  getRating() {
    this.setState({
      rating: ReviewDayStore.getRating(),
    });
  }
  
  updateRating(rating) {
    this.setState({
      saved: false
    });
    ReviewDayActions.updateRating(rating);
    this.lastKeystrokeTime = moment();
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
    this.getRating();
    this.getComment();
  }
  
  
  render() {
    return (
      <MainContent>
        <Title>Day Review</Title>
        <div>
          <label>Select Date:</label>
          <DatePicker selected={this.state.date} readOnly={true} onChange={this.updateDate} tetherConstraints={[]}/>
        </div>
        <div>
          <label>Rate Day:</label>
          <StarRating name="react-star-rating" rating={this.state.rating} editing={true} totalStars={5} onRatingClick={(e, d)=>{this.updateRating(d.rating)}} />
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