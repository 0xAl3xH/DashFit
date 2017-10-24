import React from 'react';
import moment from 'moment';
import MainContent from 'components/MainContent/MainContent';
import Title from 'components/MainContent/Title/Title';
import * as ReviewDayActions from 'actions/ReviewDayActions';
import ReviewDayStore from 'stores/ReviewDayStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.less';

export default class ReviewDay extends React.Component {
  constructor(props) {
    super(props);
    
    let now = moment();
    this.state = {
    }
  }
  
  componentWillMount() {
    //LogMealStore.on("MEALS_UPDATED", this.updateMeals);
  }
  
  componentWillUnmount() {
    //LogMealStore.removeListener("MEAL_UPDATED", this.updateMeals);
  }
  
  componentDidMount() {
  }
  
  render() {
    return (
      <MainContent>
        <Title>Day Review</Title>
      </MainContent>
    )
  }
}