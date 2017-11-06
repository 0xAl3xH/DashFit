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
    }
    this.updateDate = this.updateDate.bind(this);
    this.getRating = this.getRating.bind(this);
    this.getComment = this.getComment.bind(this);
    this.saveReview = this.saveReview.bind(this);
    this.getReview = this.getReview.bind(this);
  }
  
  componentWillMount() {
    ReviewDayStore.on("RATING_UPDATED", this.getRating);
    ReviewDayStore.on("COMMENT_UPDATED", this.getComment);
    ReviewDayStore.on("REVIEW_GOT", this.getReview);
    ReviewDayActions.getReview(this.state.date);
  }
  
  componentWillUnmount() {
    ReviewDayStore.removeListener("RATING_UPDATED", this.getRating);
    ReviewDayStore.removeListener("COMMENT_UPDATED", this.getComment);
    ReviewDayStore.removeListener("REVIEW_GOT", this.getReview);
  }
  
  componentDidMount() {
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
    ReviewDayActions.updateRating(rating);
  }
  
  getComment() {
    this.setState({
      comment: ReviewDayStore.getComment()
    });
  }
  
  updateComment(e) {
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
          <textarea id="review-day-comments" type="text" maxLength="1000" onChange={this.updateComment} value={this.state.comment}></textarea>
        </div>
          <input className="button-primary button-medium review-day-save-button" type="submit" value="Save" onClick={this.saveReview}/>
      </MainContent>
    )
  }
}