import React from 'react';
import { ResumeField } from './ResumeField.js';

export class ResumeFieldList extends React.Component {


   constructor(props) {
     super(props);
     this.state = {
       documentpath:props.documentpath
     }
   }

   componentWillReceiveProps(nextProps){
     if(this.state.hoverField !== nextProps.hoverField){
       this.setState({hoverField:nextProps.hoverField})
     }
   }

  render() {

    const { templateFields } = this.props;
    const { transcriptions } = this.props;
    const { keysSorted } = this.props;
    const { documentpath } = this.props;

    var elms = [];
    var count = 0;

    console.log("templateFields", templateFields);

    for (var i = 0; i < keysSorted.length; i++) {
      const key = keysSorted[i];
      const templateField = templateFields[key]
      const transcription = transcriptions[key];

      let value = "";
      if(transcription){
        //console.log(i, transcription.empty, transcription.value);
        if(transcription.empty) {
          value = "[Tomt felt]";
        } else if(transcription.unreadable){
          value = "[det kan jeg ikke læse]";
        } else if(transcription.value !== ""){
          value = transcription.value;
        } else {
          value = "[DETTE BURDE IKKE FOREKOMME]";
        }
      }

      elms.push(<ResumeField
                  key={key}
                  path={documentpath + "/" + key }
                  hover={this.state.hoverField === key}
                  fieldid={key}
                  index={count}
                  title={templateField.title}
                  value={value}
                  fieldClick={this.props.onFieldClick}
                  fieldOver={this.props.onFieldOver}
                  fieldOut={this.props.onFieldOut} />);

      count++;
    }




    return (
      <div style={{maxHeight:600, overflow:'auto'}}>
        {elms}
      </div>
    );
  }
}
