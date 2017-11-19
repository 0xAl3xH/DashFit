import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import * as ReviewDayActions from 'actions/ReviewDayActions';
import ReviewDayStore from 'stores/ReviewDayStore';
import DatePicker from 'react-datepicker';
import StarRating from 'react-star-rating';
import 'react-star-rating/dist/css/react-star-rating.less';
import 'react-datepicker/dist/react-datepicker.less';

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
    this.updateDate = this.updateDate.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.updateComment = this.updateComment.bind(this);
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
    ReviewDayActions.getReview(this.state.date);
    setInterval(this.autoSave, 5000);
  }
  
  componentWillUnmount() {
    ReviewDayStore.removeListener("RATING_UPDATED", this.getRating);
    ReviewDayStore.removeListener("COMMENT_UPDATED", this.getComment);
  }
  
  componentDidMount() {
  }
  
  autoSave() {
    if (!this.state.saved) {
      this.saveReview();
    }
  }
  
  updateDate(date) {
    ReviewDayActions.getReview(date.clone().hour(moment().hour()).minute(moment().minute()));
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
    console.log(this.state.saved);
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
  }
  
  saveReview() {
    const review = {
      //Keep date as a string since moment's .toJSON discards time zone info
      date: this.state.date.format(),
      rating: this.state.rating,
      comment: this.state.comment
    };
    ReviewDayActions.saveReview(review);
    this.setState({
      saved: true,
    });
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
        <div>
          <label>Comments:</label>
          {this.state.saved ? <span className="autosave-status">Changes saved...</span> : <span className="autosave-status">Some Changes Unsaved...</span>}
          <textarea id="review-day-comments" type="text" maxLength="1000" onChange={this.updateComment} value={this.state.comment}></textarea>
        </div>
          <input className="button-primary button-medium review-day-save-button" type="submit" value="Save" onClick={this.saveReview}/>
      </MainContent>
    )
  }
}