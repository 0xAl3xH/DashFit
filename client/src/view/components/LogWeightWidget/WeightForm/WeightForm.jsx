import React from 'react';
import './WeightForm.less';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.less';

export default class LogWeight extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleChangeDate = this.props.onDateSelect;
    this.handleChangeInput = this.props.onInput;
    this.submitWeight = this.props.onSubmit;
  }
  
  render() {
    return (
      <div className="row">
        <div className = "six columns">
          <label htmlFor="datepicker">Select Date:</label>
          <DatePicker id="datepicker" selected={this.props.selectedDate} onChange={this.handleChangeDate}/>
        </div>
        <div className = "six columns">
          <label htmlFor="weight_input">Today's Weight:</label>
          <input id="weight_input" type="text" value={this.props.inputWeight} onChange={this.handleChangeInput}/>
          <input className="button-primary" type="submit" value="Submit" onClick={this.submitWeight}/>
        </div>
      </div>
    );
  }
}