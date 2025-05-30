import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const input = {
  width: '300px',
  borderRadius: '4px',
  background: 'white',
  paddingLeft: 22,
  paddingRight: 10,
  paddingTop: 7,
  paddingBottom: 7,
  //marginBottom: 30,
  marginTop: 0,
  color: '#3a3f46',
  fontWeight:400,
  fontSize:14,
  resize: 'vertical',
  minHeight:20,
  maxHeight:200,
  height:'auto',
  tabIndex:1,
  //overflowY:'hidden'



}

export class UserInput extends React.Component {

   constructor(props) {
     super(props);
     this.state = {
       transcription:props.transcription,
       errorMessage:props.errorMessage,
     }
   }

   componentDidMount(){
    this.input.focus();
    this.input.addEventListener('keydown', (e) => {
      //console.log("KEYDOWN");
      //console.log(e);
      if(e.altKey){
        if(e.key === "ArrowRight"){
          if(this.props.onKeyComboRight) this.props.onKeyComboRight();
        } else if(e.key === "ArrowLeft"){
          if(this.props.onKeyComboLeft) this.props.onKeyComboLeft();
        }

      }
    }, false);

  }

   componentWillReceiveProps(nextProps){
     //console.log("userInput props", nextProps);
     this.setState({title:nextProps.title, transcription:nextProps.transcription, errorMessage:nextProps.errorMessage});
     this.input.focus();
   }

   onChangeValue = name => event => {
     //console.log('onChangeValue', name, event.target.value);

     if(name === "value"){
       console.log("AUTO HEIGHT", this.input.scrollHeight);
       this.input.style.height = 'auto';
       this.input.style.height = (this.input.scrollHeight) + 'px';
     }
     this.setState({errorMessage:""});
     this.props.onTranscriptionChange();
     this.updateTranscription(name, event.target.value);

     event.preventDefault();
   };

   onCheckboxChange = name => event => {
     //console.log('onCheckboxChange', name, event.target.checked);
     this.props.onTranscriptionChange();
     this.updateTranscription(name, event.target.checked);
   }

   updateTranscription = (name, value) => {
     console.log("updateTranscription", name, value);
     const { transcription } = this.state;

     if(name === "value"){
       transcription.unreadable = false;
       transcription.empty = false;
     }

     if(name === 'empty' && value) {
       transcription.unreadable = false;
       transcription.value = "";
     }
     if(name === 'unreadable' && value) {
       transcription.empty = false;
       transcription.value = "";
     }

     transcription.dateend = Date.now();
     transcription[name] = value;

     this.setState({
       transcription:transcription,
     });
     this.props.updateTranscription(transcription);
   }

  render() {

    const { transcription } = this.state;

    return (
      <Grid container justify="center" style={{paddingTop:20, paddingBottom:20}}>
        <Grid item>
          <Typography style={{fontSize:10, fontWeight:600, marginBottom:13}}>{this.props.title}</Typography>
          <textarea id="input"
            spellCheck="false"
            ref={(input) => { this.input = input }}
            style={input}
            onChange={this.onChangeValue('value')} value={transcription.value} />
        </Grid>
        <Grid item>

          <div style={{}}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="secondary"
                    inputProps={{tabIndex:-1}}
                    checked={transcription.empty}
                    onChange={this.onCheckboxChange('empty')}
                    value="empty"
                  />
                }
                label="Tomt felt"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    color="secondary"
                    inputProps={{tabIndex:-1}}

                    checked={transcription.unreadable}
                    onChange={this.onCheckboxChange('unreadable')}
                    value="unreadable"
                  />
                }
                label="Det kan jeg ikke læse"
              />


              </div>
        <Typography color="error" style={{maxWidth:250}}>
        { this.state.errorMessage.length > 0 ? this.state.errorMessage : " " }
        </Typography>
        </Grid>

      </Grid>



    );
  }
}
