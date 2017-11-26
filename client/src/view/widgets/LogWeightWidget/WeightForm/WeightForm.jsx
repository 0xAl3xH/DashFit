import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.less';

/**
* The component with which users input his/her weight, 
* select desired date, edit and submit inputted weight.
**/
export default class WeightForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      edit: (this.props.inputWeight != "")
    }
    
    this.handleChangeDate = (date) => {
      this.props.onDateSelect(date);
      this.setState({
        edit:false
      });
    }
    this.handleChangeInput = this.props.onInput;
    this.handleSubmit = () => {
      this.props.onSubmit()
      this.setState({
        edit:false
      });
    };
  }
  
  handleEdit() {
    this.setState({
      edit: true
    });
  }
  
  hideInput() {
    return this.props.hasRecord &&
      !this.state.edit;
  }
  
  render() {
    return (
      <div className="row weight-form">
        <div className = "six columns">
          <label htmlFor="datepicker">Select Date:</label>
          <DatePicker id="datepicker" readOnly={true} selected={this.props.selectedDate} onChange={this.handleChangeDate} tetherConstraints={[]}/>
        </div>
        {
          this.hideInput()
            ? <EditButton onClick={this.handleEdit.bind(this)}/> 
            : <SubmitForm inputWeight={this.props.inputWeight} handleChangeInput={this.handleChangeInput} handleSubmit={this.handleSubmit}/>
        }
      </div>
    );
  }
}

function SubmitForm(props) {
  return (
    <div className="six columns">
      <label htmlFor="weight-input">Input Weight:</label>
      <input id="weight-input" type="number" value={props.inputWeight} onChange={props.handleChangeInput}/>
      <input className="button-primary button-medium weight-submit" type="submit" value="Submit" onClick={props.handleSubmit}/>
    </div>
  );
}

function EditButton(props) {
  return (
    <div className="six columns">
      <label>Click to edit:</label>
      <input className="button-primary button-medium weight-submit" type="submit" value="Edit" onClick={props.onClick}/>
    </div>
  );
}